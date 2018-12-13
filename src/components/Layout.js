import React from 'react';
import { Flex, Box, Heading } from 'rebass';
import AddAuthor from './AddAuthor';
import AddBook from './AddBook';

const Layout = props => {
  return (
    <>
      <Flex bg="grey.9" py={4} justifyContent="center">
        <Flex px={3} flexDirection="column" width={900}>
          <Heading color="grey.1" mb={4}>
            📚 Book 🛍 Store
          </Heading>

          <Flex mx={-2} pb={2}>
            <Box px={2} width={1 / 2}>
              <AddBook />
            </Box>
            <Box px={2} width={1 / 2}>
              <AddAuthor />
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Box my={5}>{props.children}</Box>
    </>
  );
};

Layout.propTypes = {};

export default Layout;
