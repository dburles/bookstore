import { navigate } from '@reach/router';
import React, { useState } from 'react';
import { unstable_scheduleCallback } from 'scheduler';
import Books from './Books';
import ErrorMessage from './ErrorMessage';
import { useMutation, useQuery } from './lib/graphql';

const booksQuery = /* GraphQL */ `
  query books {
    books {
      id
      title
      author {
        id
        name
      }
    }
  }
`;

const bookRemoveMutation = /* GraphQL */ `
  mutation bookRemove($input: BookRemoveInput!) {
    bookRemove(input: $input) {
      book {
        id
      }
    }
  }
`;

const BooksContainer = props => {
  const [loadingId, setLoadingId] = useState();

  const {
    data: { books = [] },
    error: queryError,
  } = useQuery('http://localhost:3010/graphql', booksQuery);

  const [removingBookIds, setRemovingBookIds] = useState('');

  const { mutate, error: removeError } = useMutation(
    'http://localhost:3010/graphql',
    bookRemoveMutation,
  );

  if (queryError || removeError) {
    return <ErrorMessage>{queryError || removeError}</ErrorMessage>;
  }

  return (
    <Books
      title="All Books"
      books={books}
      loadingId={loadingId}
      onClickAuthor={(bookId, authorId) => {
        setLoadingId(bookId);
        unstable_scheduleCallback(() => navigate(`/author/${authorId}`));
      }}
      onRemoveBook={bookId => {
        setRemovingBookIds([...new Set([...removingBookIds, bookId])]);
        mutate({ variables: { input: { id: bookId } } });
      }}
      removingBookIds={removingBookIds}
    />
  );
};

export default BooksContainer;
