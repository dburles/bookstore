import React from 'react';
import { Flex, Heading, Box } from 'rebass';
import Nav from './Nav';

const Container = props => {
  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" p={3}>
        <Nav />
      </Flex>
      {props.children}
    </Flex>
  );
};

export default Container;
