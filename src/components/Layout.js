import { navigate } from '@reach/router';
import React from 'react';
import { Flex, Box, Heading } from 'rebass';
import AddAuthor from './AddAuthor';
import AddBook from './AddBook';

const Layout = props => {
  return (
    <>
      <Flex bg="grey.9" py={4} justifyContent="center">
        <Flex px={3} flexDirection="column" width={[1, 900]}>
          <Heading color="grey.1" mb={4} onClick={() => navigate('/')}>
            📚 Book 🛍 Store
          </Heading>

          <Flex m={-3} pb={2} flexWrap="wrap">
            <Box p={3} width={[1, 1 / 2]}>
              <AddBook />
            </Box>
            <Box p={3} width={[1, 1 / 2]}>
              <AddAuthor />
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex my={5} justifyContent="center">
        <Flex px={3} flexDirection="column" width={[1, 900]}>
          <Box>{props.children}</Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Layout;
