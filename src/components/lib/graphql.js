import { useState, useEffect } from 'react';

const subscriptions = [];
const onMutation = callback => {
  subscriptions.push(callback);
  return () => subscriptions.splice(subscriptions.indexOf(callback), 1);
};

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

const queryCache = [];

window.queryCache = queryCache;

export const useQuery = (uri, query, options = {}) => {
  const [refetchCache, setRefetchCache] = useState();

  const cached = queryCache.find(
    qc =>
      JSON.stringify({ uri: qc.uri, query: qc.query, options: qc.options }) ===
      JSON.stringify({ uri, query, options }),
  );

  // Refetch after mutation
  useEffect(
    () =>
      onMutation(() =>
        fetchGraphQL(uri, query, cached.options).then(setRefetchCache),
      ),
    [],
  );

  if (!cached) {
    const cache = {
      uri,
      query,
      options,
      promise: fetchGraphQL(uri, query, options).then(
        response => (cache.response = response),
      ),
    };

    queryCache.push(cache);

    throw cache.promise;
  }

  // cache.response is the result of the initial fetch
  // refetchCache is the result of a subsequent fetch after a mutation occurs
  if (refetchCache || cached.response) {
    return refetchCache || cached.response;
  }

  throw cached.promise;
};

export const useMutation = (uri, query) => {
  const [state, setState] = useState({ data: {}, loading: false });

  const mutate = options => {
    setState({ ...state, loading: true });
    return fetchGraphQL(uri, query, options)
      .then(data => {
        if (!data.error) {
          subscriptions.forEach(cb => cb());
        }
        return data;
      })
      .then(setState);
  };

  return { mutate, ...state };
};
