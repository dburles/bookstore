import React from 'react';
import { Text, Flex, Box, Card } from 'rebass';
import Container from './Container';
import FauxLink from './FauxLink';
import Spinner from './Spinner';

const Books = props => {
  return (
    <Container title={props.title}>
      <Card
        bg="white"
        borderColor="grey.3"
        border="1px solid"
        borderRadius={3}
        flexWrap="wrap"
      >
        {props.books.map(book => (
          <Card key={book.id} p={1} borderColor="grey.3" borderTop="1px solid">
            <Flex alignItems="top" p={3}>
              <Box width={1 / 8}>
                <Text fontSize={0} color="grey.7">
                  {book.id}
                </Text>
              </Box>
              <Box width={1}>
                <Text fontSize={2}>{book.title}</Text>
                <Text fontSize={1} color="grey.8">
                  {props.onClickAuthor ? (
                    <FauxLink
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
              <Box width={1 / 8} style={{ position: 'relative' }}>
                <Text textAlign="right">
                  {props.loadingId === book.id ? (
                    <Spinner />
                  ) : (
                    <FauxLink
                      color="grey.7"
                      fontSize={1}
                      onClick={() => props.onRemoveBook(book.id)}
                    >
                      {props.removingBookIds.includes(book.id)
                        ? 'Removing...'
                        : 'Remove'}
                    </FauxLink>
                  )}
                </Text>
              </Box>
            </Flex>
          </Card>
        ))}
      </Card>
    </Container>
  );
};

export default Books;
