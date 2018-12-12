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
const invalidateCache = () =>
  Object.keys(queryCache).forEach(key => (queryCache[key].isStale = true));

export const useQuery = (uri, query, options = {}) => {
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const key = fnv1a(uri + query + JSON.stringify(options.variables));

  // Any mounted useQuery must refetch once a mutation occurs
  useEffect(() => {
    return mutations.subscribe(() => {
      // Only refetch if we have existing cache
      if (queryCache[key]) {
        console.log('refetching');
        fetchGraphQL(uri, query, options).then(response => {
          queryCache[key].response = response;
          setShouldRefetch(true);
        });
      }
    });
  });

  if ((!queryCache[key] && !shouldRefetch) || queryCache[key].isStale) {
    console.log('no cache');
    queryCache[key] = {};
    queryCache[key].promise = fetchGraphQL(uri, query, options).then(
      response => (queryCache[key].response = response),
    );
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
    const promise = fetchGraphQL(uri, query, options).then(response => {
      if (!response.error) {
        invalidateCache();
        mutations.notify();
      }
      if (mountedRef.current) {
        setState(response);
      }
      return response;
    });

    return promise;
  };

  return { mutate, ...state };
};
