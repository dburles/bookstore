import { Router } from '@reach/router';
import React, { ConcurrentMode, Suspense } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import AllBooks from './components/AllBooks';
import AuthorBooks from './components/AuthorBooks';
import GlobalStyle from './components/GlobalStyle';
import Spinner from './components/Spinner';
import theme from './theme';

const FewBooks = () => (
  <Suspense maxDuration={2000} fallback={<Spinner full />}>
    <AllBooks />
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

        <Router>
          <FewBooks exact path="/" />
          <SuspenseAuthorBooks path="/author/:authorId" />
        </Router>
      </>
    </ThemeProvider>
  </ConcurrentMode>,
  document.getElementById('root'),
);
