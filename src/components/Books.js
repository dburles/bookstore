/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui';
import Container from './Container';
import FauxLink from './FauxLink';
import Spinner from './Spinner';
import Text from './Text';

const Books = props => {
  return (
    <Container title={props.title}>
      <div
        sx={{
          bg: 'white',
          borderColor: 'grey.3',
          border: '1px solid',
          borderRadius: 3,
          flexWrap: 'wrap',
        }}
      >
        {props.books.map(book => (
          <div
            key={book.id}
            sx={{ p: 1, borderColor: 'grey.3', borderTop: '1px solid' }}
          >
            <Flex sx={{ alignItems: 'top', p: 3 }}>
              <Box sx={{ width: '12.5%' }}>
                <Text sx={{ fontSize: 0, color: 'grey.7' }}>{book.id}</Text>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Text sx={{ fontSize: 2 }}>{book.title}</Text>
                <Text sx={{ fontSize: 1, color: 'grey.8' }}>
                  {props.onClickAuthor ? (
                    <FauxLink
                      onClick={() =>
                        props.onClickAuthor(book.id, book.author.id)
                      }
                    >
                      {book.author.name}
                    </FauxLink>
                  ) : (
                    book.author.name
                  )}
                </Text>
              </Box>
              <Box sx={{ width: '12.5%', position: 'relative' }}>
                <Text sx={{ textAlign: 'right' }}>
                  {props.loadingId === book.id ? (
                    <Spinner />
                  ) : (
                    <FauxLink
                      sx={{
                        color: 'grey.7',
                        fontSize: 0,
                      }}
                      onClick={() => props.onRemoveBook(book.id)}
                    >
                      {props.removingBookIds.includes(book.id)
                        ? 'Removing...'
                        : 'Remove'}
                    </FauxLink>
                  )}
                </Text>
              </Box>
            </Flex>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Books;
