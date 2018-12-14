import { Router } from '@reach/router';
import React, { ConcurrentMode, Suspense } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import AllBooks from './components/AllBooks';
import AuthorBooks from './components/AuthorBooks';
import GlobalStyle from './components/GlobalStyle';
import Layout from './components/Layout';
import Spinner from './components/Spinner';
import theme from './theme';

const SuspenseAllBooks = () => (
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

        <Layout>
          <Router>
            <SuspenseAllBooks exact path="/" />
            <SuspenseAuthorBooks path="/author/:authorId" />
          </Router>
        </Layout>
      </>
    </ThemeProvider>
  </ConcurrentMode>,
  document.getElementById('root'),
);
