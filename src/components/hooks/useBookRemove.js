import { useState } from 'react';
import { useMutation } from '../lib/graphql';

const bookRemoveMutation = /* GraphQL */ `
  mutation bookRemove($input: BookRemoveInput!) {
    bookRemove(input: $input) {
      book {
        id
      }
    }
  }
`;

function useBookRemove() {
  const [removingBookIds, setRemovingBookIds] = useState('');

  const { mutate, error } = useMutation(
    'http://localhost:3010/graphql',
    bookRemoveMutation,
  );

  function removeBook(bookId) {
    setRemovingBookIds([...new Set([...removingBookIds, bookId])]);
    mutate({ variables: { input: { id: bookId } } });
  }

  return {
    error,
    removingBookIds,
    removeBook,
  };
}

export default useBookRemove;
