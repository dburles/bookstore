import { Router } from '@reach/router';
import { Link } from '@reach/router';
import React, { ConcurrentMode, StrictMode, Suspense } from 'react';
import { render } from 'react-dom';
import { Flex, Box } from 'rebass';
import AuthorBooks from './components/AuthorBooks';
import Books from './components/Books';

const FewBooks = () => (
  <Flex>
    <Books />
    <Books />
    <Books />
  </Flex>
);

render(
  <ConcurrentMode>
    <Flex alignItems="center" flexDirection="column">
      <Box>
        <Flex>
          <Link to="/">Home</Link>
          <Link to="/one">One</Link>
          <Link to="/two">Two</Link>
        </Flex>
      </Box>
      <Box>
        <Suspense maxDuration={1000} fallback={<p>Loading...</p>}>
          <Router>
            <FewBooks exact path="/" />
            <AuthorBooks path="/one" authorId={1} />
            <AuthorBooks path="/two" authorId={2} />
          </Router>
        </Suspense>
      </Box>
    </Flex>
  </ConcurrentMode>,
  document.getElementById('root'),
);
