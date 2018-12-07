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

export const GraphQLQuery = (uri, query) => {
  let cache = {
    options: undefined,
    promise: undefined,
    response: undefined,
  };

  return (options = {}) => {
    const [refetchCache, setRefetchCache] = useState();

    if (JSON.stringify(cache.options) !== JSON.stringify(options)) {
      cache.options = options;

      cache.promise = fetchGraphQL(uri, query, options).then(
        response => (cache.response = response),
      );

      throw cache.promise;
    }

    // Refetch after mutation
    useEffect(
      () =>
        onMutation(() =>
          fetchGraphQL(uri, query, cache.options).then(setRefetchCache),
        ),
      [options.variables],
    );

    // cache.response is the result of the initial fetch
    // refetchCache is the result of a subsequent fetch after a mutation occurs
    if (refetchCache || cache.response) {
      return refetchCache || cache.response;
    }

    throw cache.promise;
  };
};

export const useQuery = (uri, query, options = {}) => {
  const [state, setState] = useState({ data: {}, loading: true });

  const fetcher = () => fetchGraphQL(uri, query, options).then(setState);

  useEffect(
    () => {
      fetcher();
    },
    [uri, query, options.variables],
  );

  useEffect(() => onMutation(() => fetcher()), []);

  return state;
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
