import fnv1a from '@sindresorhus/fnv1a';
import { useState, useEffect, useRef } from 'react';

const createSubscription = () => {
  const subscriptions = [];
  const subscribe = callback => {
    subscriptions.push(callback);
    return () => subscriptions.splice(subscriptions.indexOf(callback), 1);
  };
  const notify = () => subscriptions.forEach(cb => cb());
  return { notify, subscribe };
};

const mutations = createSubscription();
const cacheUpdates = createSubscription();

const requestOptions = {
  method: 'post',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const fetchOptions = (query, options) => ({
  ...requestOptions,
  ...options.requestOptionsOverride,
  body: JSON.stringify({ query, variables: options.variables || null }),
});

const fetchGraphQL = (uri, query, options) => {
  return fetch(uri, fetchOptions(query, options))
    .then(response => response.json())
    .then(handleGraphQLResponse)
    .catch(error => ({
      data: {},
      loading: false,
      error: error.message,
    }));
};

const handleGraphQLResponse = response => {
  if (response.errors) {
    // eslint-disable-next-line
    response.errors.forEach(console.error);
  }
  return {
    data: response.data || {},
    loading: false,
    ...(response.errors && { error: 'GraphQL Error' }),
  };
};

const queryCache = {};

window.queryCache = queryCache;

const invalidateCache = () =>
  Object.keys(queryCache).forEach(key => (queryCache[key].stale = true));

export const useQuery = (uri, query, options = {}) => {
  // Tracks whether we should fetch or refetch queries
  const refetchRef = useRef(false);
  // Used to re-render the component after a refetch
  const [, update] = useState();
  const key = fnv1a(uri + query + JSON.stringify(options.variables));

  const fetchAndUpdateCache = () =>
    fetchGraphQL(uri, query, options).then(response => {
      queryCache[key].response = response;
      queryCache[key].stale = false;
      queryCache[key].refetching = false;
    });

  // Any mounted useQuery must refetch after a mutation occurs
  useEffect(
    () =>
      mutations.subscribe(() => {
        refetchRef.current = true;

        if (
          queryCache[key] &&
          queryCache[key].stale &&
          !queryCache[key].refetching
        ) {
          queryCache[key].refetching = true;
          fetchAndUpdateCache().then(() => cacheUpdates.notify());
        }
      }),
    [options.variables],
  );

  useEffect(() => cacheUpdates.subscribe(() => update()), []);

  // Handles a fresh mount
  if (!refetchRef.current && (!queryCache[key] || queryCache[key].stale)) {
    if (!queryCache[key]) {
      queryCache[key] = {};
    }
    queryCache[key].promise = fetchAndUpdateCache();
    throw queryCache[key].promise;
  }

  if (queryCache[key].response) {
    return queryCache[key].response;
  }

  throw queryCache[key].promise;
};

export const useMutation = (uri, query) => {
  const [state, setState] = useState({ data: {}, loading: false });
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const mutate = options => {
    setState({ ...state, loading: true });
    return fetchGraphQL(uri, query, options).then(response => {
      if (mountedRef.current) {
        setState(response);
      }
      if (!response.error) {
        invalidateCache();
        mutations.notify();
      }
      return response;
    });
  };

  return { mutate, ...state };
};
