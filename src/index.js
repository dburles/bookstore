import { Router, Link } from '@reach/router';
import React, { ConcurrentMode, Suspense } from 'react';
import { render } from 'react-dom';
import { Flex, Box } from 'rebass';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import AuthorBooks from './components/AuthorBooks';
import Books from './components/Books';
import Spinner from './components/Spinner';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    line-height: 1.5;
  }
`;

const FewBooks = () => (
  <Suspense maxDuration={2000} fallback={<Spinner full />}>
    <Flex>
      <Books />
    </Flex>
  </Suspense>
);

const SuspenseAuthorBooks = props => (
  <Suspense maxDuration={2000} fallback={<Spinner full />}>
    <AuthorBooks {...props} />
  </Suspense>
);

render(
  <ConcurrentMode>
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <Flex alignItems="center" flexDirection="column">
          <Box>
            <Flex>
              <Link to="/">Home</Link>
              <Link to="/one">One</Link>
              <Link to="/two">Two</Link>
            </Flex>
          </Box>
          <Box>
            <Router>
              <FewBooks exact path="/" />
              <SuspenseAuthorBooks path="/author/:authorId" />
            </Router>
          </Box>
        </Flex>
      </>
    </ThemeProvider>
  </ConcurrentMode>,
  document.getElementById('root'),
);
