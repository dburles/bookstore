import React from 'react';
import { Flex, Heading, Box } from 'rebass';
import Nav from './Nav';

const Container = props => {
  return (
    <Flex flexDirection="column" alignItems="center">
      <Box width={900}>
        <Flex alignItems="center" p={3}>
          <Heading width={1}>{props.title}</Heading>
          <Nav />
        </Flex>
        {props.children}
      </Box>
    </Flex>
  );
};

export default Container;
