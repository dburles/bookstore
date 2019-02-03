import { navigate } from '@reach/router';
import React, { useState } from 'react';
import { unstable_scheduleCallback } from 'scheduler';
import Books from './Books';
import ErrorMessage from './ErrorMessage';
import useBookRemove from './hooks/useBookRemove';
import { useQuery } from './lib/graphql';

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

const BooksContainer = props => {
  const [loadingId, setLoadingId] = useState();

  const {
    data: { books = [] },
    error: queryError,
  } = useQuery('http://localhost:3010/graphql', booksQuery);

  const { removeBook, removingBookIds, error: removeError } = useBookRemove();

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
      onRemoveBook={removeBook}
      removingBookIds={removingBookIds}
    />
  );
};

export default BooksContainer;
