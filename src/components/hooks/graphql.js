import { useState, useEffect } from 'react';

const mutationSubscriptions = [];
export const onMutation = callback => {
  mutationSubscriptions.push(callback);
  return () =>
    mutationSubscriptions.splice(mutationSubscriptions.indexOf(callback), 1);
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
    response.errors.forEach(console.error);
  }
  return {
    data: response.data || {},
    loading: false,
    ...(response.errors && { error: 'GraphQL Error' }),
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
          mutationSubscriptions.forEach(cb => cb());
        }
        return data;
      })
      .then(setState);
  };

  return { mutate, ...state };
};
