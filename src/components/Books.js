import { Link } from '@reach/router';
import React from 'react';
import { Text, Flex, Box, Card, Heading } from 'rebass';
import styled from 'styled-components';
import AddBook from './AddBook';
import Spinner from './Spinner';

const FauxLink = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
`;

const Books = props => {
  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" p={3}>
        <Heading width={1}>{props.heading}</Heading>
        <Link to="/">Home</Link>
      </Flex>
      <Card
        flexDirection="column"
        width={1}
        bg="white"
        borderColor="grey.3"
        border="1px solid"
        borderRadius={3}
      >
        <AddBook />
        {props.books.map(book => (
          <Card
            key={book.id}
            px={1}
            py={1}
            borderColor="grey.3"
            borderTop="1px solid"
          >
            <Flex alignItems="top" p={3}>
              <Box width={1 / 6}>
                <Text fontSize={0} color="grey.7">
                  {book.id}
                </Text>
              </Box>
              <Box width={1}>
                <Text fontSize={2}>{book.title}</Text>
                <Text fontSize={1} color="grey.8">
                  {props.onClickAuthor ? (
                    <FauxLink
                      color="orange.5"
                      onClick={() =>
                        props.onClickAuthor(book.id, book.author.id)
                      }
                    >
                      {book.author.name}
                    </FauxLink>
                  ) : (
                    book.author.name
                  )}
                </Text>
              </Box>
              <Box width={1 / 5} style={{ position: 'relative' }}>
                {props.loadingId === book.id ? (
                  <Spinner />
                ) : (
                  <FauxLink
                    color="grey.7"
                    fontSize={1}
                    onClick={() => props.onRemoveBook(book.id)}
                  >
                    Remove
                  </FauxLink>
                )}
              </Box>
            </Flex>
          </Card>
        ))}
      </Card>
    </Flex>
  );
};

export default Books;
