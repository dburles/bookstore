/** @jsx jsx */
import { navigate } from '@reach/router';
import { Suspense } from 'react';
import { jsx, Flex, Box } from 'theme-ui';
import AddAuthor from './AddAuthor';
import AddBook from './AddBook';
import Heading from './Heading';
import Spinner from './Spinner';

const Layout = props => {
  return (
    <Suspense maxDuration={2000} fallback={<Spinner fullScreen />}>
      <Flex sx={{ bg: 'grey.9', py: 4, justifyContent: 'center' }}>
        <Flex sx={{ px: 3, flexDirection: 'column', width: ['100%', 900] }}>
          <Heading
            onClick={() => navigate('/')}
            sx={{ color: 'grey.1', mb: 4, cursor: 'pointer' }}
          >
            📚 Book 🛍 Store
          </Heading>

          <Flex sx={{ m: -3, pb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ p: 3, width: ['100%', '50%'] }}>
              <AddBook />
            </Box>
            <Box sx={{ p: 3, width: ['100%', '50%'] }}>
              <AddAuthor />
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex sx={{ my: 5, justifyContent: 'center' }}>
        <Box sx={{ px: 3, flexDirection: 'column', width: ['100%', 900] }}>
          <Box>{props.children}</Box>
        </Box>
      </Flex>
    </Suspense>
  );
};

export default Layout;
