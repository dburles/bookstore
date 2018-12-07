import React, { useState } from 'react';
import { Flex, Box } from 'rebass';
import AddBook from './AddBook';
import ErrorMessage from './ErrorMessage';
import { useMutation, GraphQLQuery } from './lib/graphql';

const booksQuery = /* GraphQL */ `
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

const bookRemoveMutation = /* GraphQL */ `
  mutation bookRemove($input: BookRemoveInput!) {
    bookRemove(input: $input) {
      book {
        id
      }
    }
  }
`;

const useBooks = GraphQLQuery('http://localhost:3010/graphql', booksQuery);

const Books = props => {
  const {
    data: { books = [] },
    error,
  } = useBooks();

  const [removingBookId, setRemovingBookId] = useState('');

  const { mutate } = useMutation(
    'http://localhost:3010/graphql',
    bookRemoveMutation,
  );

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Flex flexDirection="column">
      {books.map(book => (
        <Box key={book.id}>
          <Flex alignItems="center" m={1}>
            <Box width={1} pr={3}>
              {book.id} {book.title} by {book.author.name}{' '}
            </Box>
            <Box>
              <button
                disabled={removingBookId === book.id}
                onClick={() => {
                  setRemovingBookId(book.id);
                  mutate({ variables: { input: { id: book.id } } });
                }}
              >
                x
              </button>
            </Box>
          </Flex>
        </Box>
      ))}
      <AddBook />
    </Flex>
  );
};

export default Books;
