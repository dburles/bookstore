import { useState, useEffect } from 'react';
import { onMutation } from '../../graphql';

export const useQuery = (query, variables) => {
  const [state, setState] = useState({ data: {}, loading: true });

  const handle = ({ data = {}, error, errors }) => {
    const errorMessage = errors ? 'Bad GraphQL query' : error;
    setState({ data, error: errorMessage, loading: false });
  };

  useEffect(
    () => {
      query.fetch(variables).then(handle);
    },
    [variables],
  );

  useEffect(() => onMutation(() => query.refetch().then(handle)), []);

  return state;
};
