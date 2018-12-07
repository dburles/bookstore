import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Flex } from 'rebass';
import Books from './components/Books';

render(
  <Flex justifyContent="center">
    <Suspense fallback={<p>Loading...</p>}>
      <Books />
      <Books />
    </Suspense>
  </Flex>,
  document.getElementById('root'),
);
