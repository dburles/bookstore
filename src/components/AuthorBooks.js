/** @jsx jsx */
import { jsx } from 'theme-ui';
import Books from './Books';
import ErrorMessage from './ErrorMessage';
import useBookRemove from './hooks/useBookRemove';
import { useQuery } from './lib/graphql';

const authorQuery = /* GraphQL */ `
  query author($id: Int!) {
    author(id: $id) {
      name
      books {
        id
        title
        author {
          id
          name
        }
      }
    }
  }
`;

const AuthorBooksContainer = props => {
  const {
    data: { author },
    error: queryError,
  } = useQuery('http://localhost:3010/graphql', authorQuery, {
    variables: { id: Number(props.authorId) },
  });

  const { removeBook, removingBookIds, error: removeError } = useBookRemove();

  if (queryError || removeError) {
    return <ErrorMessage>{queryError || removeError}</ErrorMessage>;
  }

  return (
    <Books
      title={author.name}
      books={author.books}
      onRemoveBook={removeBook}
      removingBookIds={removingBookIds}
    />
  );
};

export default AuthorBooksContainer;
