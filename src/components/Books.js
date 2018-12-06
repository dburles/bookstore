import React, { useState } from 'react';
import AddBook from './AddBook';
import ErrorMessage from './ErrorMessage';
import { useQuery, useMutation } from './hooks/graphql';

const booksQuery = `
  query books {
    books {
      id
      title
      author {
        name
      }
    }
  }
`;

const bookRemoveMutation = `
  mutation bookRemove($input: BookRemoveInput!) {
    bookRemove(input: $input) {
      book {
        id
      }
    }
  }
`;

const Books = props => {
  const {
    data: { books = [] },
    loading,
    error,
  } = useQuery('http://localhost:3010/graphql', booksQuery);

  const [removingBookId, setRemovingBookId] = useState('');

  const { mutate } = useMutation(
    'http://localhost:3010/graphql',
    bookRemoveMutation,
  );

  // console.log(books, loading, error);

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <ul>
      {books.map(book => (
        <li key={book.id}>
          {book.id} {book.title} by {book.author.name}{' '}
          <button
            disabled={removingBookId === book.id}
            onClick={() => {
              setRemovingBookId(book.id);
              mutate({ variables: { input: { id: book.id } } });
            }}
          >
            x
          </button>
        </li>
      ))}
      <AddBook />
    </ul>
  );
};

export default Books;
