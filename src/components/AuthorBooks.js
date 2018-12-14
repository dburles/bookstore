import React, { useState } from 'react';
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
  const {
    data: { author },
    error: queryError,
  } = useQuery('http://localhost:3010/graphql', authorQuery, {
    variables: { id: props.authorId },
  });

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
      title={author.name}
      books={author.books}
      onRemoveBook={bookId => {
        setRemovingBookIds([...new Set([...removingBookIds, bookId])]);
        mutate({ variables: { input: { id: bookId } } });
      }}
      removingBookIds={removingBookIds}
    />
  );
};

export default AuthorBooksContainer;
