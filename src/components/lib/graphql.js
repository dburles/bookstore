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

const queryCache = new Map();

const invalidateCache = () => {
  queryCache.forEach(value => (value.stale = true));
};

export const useQuery = (uri, query, options = {}) => {
  // Tracks whether we should fetch or refetch queries
  const refetchRef = useRef(false);
  // Used to re-render the component after a refetch
  const [, update] = useState({});
  const key = fnv1a(uri + query + JSON.stringify(options.variables));

  let cache = queryCache.get(key);

  const fetchAndUpdateCache = () =>
    fetchGraphQL(uri, query, options).then(response => {
      cache.response = response;
      cache.stale = false;
      cache.refetching = false;
    });

  // Any mounted useQuery must refetch after a mutation occurs
  useEffect(
    () =>
      mutations.subscribe(() => {
        refetchRef.current = true;

        if (cache && cache.stale && !cache.refetching) {
          cache.refetching = true;
          fetchAndUpdateCache().then(() => cacheUpdates.notify());
        }
      }),
    [options.variables],
  );

  useEffect(() => cacheUpdates.subscribe(() => update({})), []);

  // Handles a fresh mount
  if (!refetchRef.current && (!cache || (cache && cache.stale))) {
    if (!cache) {
      cache = {};
      queryCache.set(key, cache);
    }
    cache.promise = fetchAndUpdateCache();
    throw cache.promise;
  }

  if (cache.response) {
    return cache.response;
  }

  throw cache.promise;
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
