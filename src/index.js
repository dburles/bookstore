import React from 'react';
import { render } from 'react-dom';
import { Flex } from 'rebass';
import Books from './components/Books';

render(
  <Flex justifyContent="center">
    <Books />
    <Books />
  </Flex>,
  document.getElementById('root'),
);
