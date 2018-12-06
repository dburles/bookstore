import PropTypes from 'prop-types';
import React from 'react';
import { GraphQLQuery } from '../graphql';
import AddBook from './AddBook';
import ErrorMessage from './ErrorMessage';
import { useQuery } from './hooks/graphql';

const query = GraphQLQuery({
  url: 'http://localhost:3010/graphql',
  cache: true,
  query: `
    query books {
      books {
        id
        title
        author {
          name
        }
      }
    }
  `,
});

const Books = props => {
  const {
    data: { books = [] },
    loading,
    error,
  } = useQuery(query);

  console.log(books, loading, error);

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <ul>
      {books.map(book => (
        <li key={book.id}>
          {book.id} {book.title} by {book.author.name}
        </li>
      ))}
      <AddBook />
    </ul>
  );
};

Books.propTypes = {};

export default Books;
