import { navigate } from '@reach/router';
import React, { useState } from 'react';
import { Text, Flex, Box } from 'rebass';
import { unstable_scheduleCallback } from 'scheduler';
import styled from 'styled-components';
import AddBook from './AddBook';
import ErrorMessage from './ErrorMessage';
import { useMutation, useQuery } from './lib/graphql';
import Spinner from './Spinner';

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

const FauxLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const Books = props => {
  const [loadingId, setLoadingId] = useState();

  const {
    data: { books = [] },
    error: queryError,
  } = useQuery('http://localhost:3010/graphql', booksQuery);

  const [removingBookId, setRemovingBookId] = useState('');

  const { mutate, error: removeError } = useMutation(
    'http://localhost:3010/graphql',
    bookRemoveMutation,
  );

  if (queryError || removeError) {
    return <ErrorMessage>{queryError || removeError}</ErrorMessage>;
  }

  return (
    <Flex flexDirection="column">
      {books.map(book => (
        <Box key={book.id}>
          <Flex alignItems="center" m={1}>
            <Box width={1} pr={3}>
              <Text>
                {book.id} {book.title} by{' '}
                <FauxLink
                  onClick={() => {
                    setLoadingId(book.id);
                    unstable_scheduleCallback(() =>
                      navigate(`/author/${book.author.id}`),
                    );
                  }}
                >
                  {book.author.name}
                </FauxLink>
              </Text>
            </Box>
            <Box style={{ position: 'relative' }}>
              {loadingId === book.id ? (
                <Spinner />
              ) : (
                <button
                  disabled={removingBookId === book.id}
                  onClick={() => {
                    setRemovingBookId(book.id);
                    mutate({ variables: { input: { id: book.id } } });
                  }}
                >
                  x
                </button>
              )}
            </Box>
          </Flex>
        </Box>
      ))}
      <AddBook />
    </Flex>
  );
};

export default Books;
