import { navigate } from '@reach/router';
import React, { useState } from 'react';
import { unstable_scheduleCallback } from 'scheduler';
import Books from './Books';
import ErrorMessage from './ErrorMessage';
import { useMutation, useQuery } from './lib/graphql';

const authorQuery = /* GraphQL */ `
  query author($id: Int!) {
    author(id: $id) {
      name
      books {
        id
        title
        author {
          id
          name
        }
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

const AuthorBooksContainer = props => {
  const [loadingId, setLoadingId] = useState();

  const {
    data: { author },
    error,
  } = useQuery('http://localhost:3010/graphql', authorQuery, {
    variables: { id: props.authorId },
  });

  const [removingBookId, setRemovingBookId] = useState('');

  const { mutate } = useMutation(
    'http://localhost:3010/graphql',
    bookRemoveMutation,
  );

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Books
      heading={author.name}
      books={author.books}
      loadingId={loadingId}
      onRemoveBook={bookId => {
        setRemovingBookId(bookId);
        mutate({ variables: { input: { id: bookId } } });
      }}
    />
  );
};

export default AuthorBooksContainer;
