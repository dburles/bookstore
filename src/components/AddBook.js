import React from 'react';
import { GraphQLQuery, GraphQLMutation } from '../lib/graphql';
import { useQuery } from './hooks/graphql';
import { useFormState } from './hooks/useFormState';

const query = GraphQLQuery({
  url: 'http://localhost:3010/graphql',
  query: `
    query authors {
      authors {
        id
        name
      }
    }
  `,
});

const mutation = GraphQLMutation({
  url: 'http://localhost:3010/graphql',
  query: `
    mutation bookAdd($input: BookAddInput!) {
      bookAdd(input: $input) {
        book {
          id
          title
        }
      }
    }
  `,
});

const AddBook = props => {
  const [formState, onChange] = useFormState({
    authorId: '',
    title: '',
  });
  const {
    data: { authors = [] },
    loading,
    error,
  } = useQuery(query);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        console.log(formState);
        mutation.fetch({
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
      <button disabled={!formState.authorId}>Add</button>
    </form>
  );
};

AddBook.propTypes = {};

export default AddBook;
