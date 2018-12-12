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

export const useQuery = (uri, query, options = {}) => {
  const [isRefetch, setRefetched] = useState(false);

  const key = fnv1a(uri + query + JSON.stringify(options.variables));
  const cached = queryCache[key];

  // Trigger re-render after mutation
  useEffect(() => {
    return mutations.subscribe(() => {
      fetchGraphQL(uri, query, options).then(response => {
        queryCache[key] = {
          response,
        };
        cacheUpdates.notify();
      });
    });
  }, []);

  // Listen for cache updates
  useEffect(() => cacheUpdates.subscribe(() => setRefetched(true)), []);

  if (!cached && !isRefetch) {
    queryCache[key] = {};
    queryCache[key].promise = fetchGraphQL(uri, query, options).then(
      response => (queryCache[key].response = response),
    );

    throw queryCache[key].promise;
  }

  if (cached.response) {
    return cached.response;
  }

  throw cached.promise;
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
