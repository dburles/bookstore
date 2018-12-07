import React from 'react';
import ErrorMessage from './ErrorMessage';
import { useMutation, GraphQLQuery } from './hooks/graphql';
import { useFormState } from './hooks/useFormState';

const authorsQuery = /* GraphQL */ `
  query authors {
    authors {
      id
      name
    }
  }
`;

const bookAddMutation = /* GraphQL */ `
  mutation bookAdd($input: BookAddInput!) {
    bookAdd(input: $input) {
      book {
        id
        title
      }
    }
  }
`;

const useAuthors = GraphQLQuery('http://localhost:3010/graphql', authorsQuery);

const AddBook = props => {
  const [formState, onChange] = useFormState({
    authorId: '',
    title: '',
  });

  const {
    data: { authors = [] },
    error,
  } = useAuthors();

  const {
    mutate: addBook,
    loading: isSubmitting,
    error: bookAddError,
  } = useMutation('http://localhost:3010/graphql', bookAddMutation);

  // console.log(error, bookAddError);

  if (error || bookAddError) {
    return <ErrorMessage>{error || bookAddError}</ErrorMessage>;
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault();

        addBook({
          variables: {
            input: formState,
          },
        });
      }}
    >
      <select onChange={onChange} name="authorId">
        <option value="">Select Author</option>
        {authors.map(author => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="title"
        value={formState.title}
        onChange={onChange}
      />
      <button disabled={!formState.authorId || isSubmitting}>Add</button>
    </form>
  );
};

export default AddBook;
