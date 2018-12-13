import React from 'react';
import { Button, Flex } from 'rebass';
import styled from 'styled-components';
import { space, width, fontSize } from 'styled-system';
import ErrorMessage from './ErrorMessage';
import { useFormState } from './hooks/useFormState';
import { useMutation, useQuery } from './lib/graphql';

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

const Select = styled.select`
  ${space}
  ${width}
  height: 40px;
`;

const Input = styled.input`
  ${space}
  ${width}
  ${fontSize}
  height: 40px;
`;

const AddBook = props => {
  const [formState, onChange] = useFormState({
    authorId: '',
    title: '',
  });

  const {
    data: { authors = [] },
    error,
  } = useQuery('http://localhost:3010/graphql', authorsQuery);

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
      <Flex flexDirection="row" p={3}>
        <Select onChange={onChange} name="authorId">
          <option value="">Select Author</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </Select>
        <Input
          fontSize={1}
          px={3}
          mx={3}
          width={1}
          type="text"
          name="title"
          value={formState.title}
          onChange={onChange}
          placeholder="Book title"
        />
        <Button bg="base" disabled={!formState.authorId || isSubmitting}>
          Add
        </Button>
      </Flex>
    </form>
  );
};

export default AddBook;
