import React from 'react';
import { Button, Flex, Box, Heading } from 'rebass';
import ErrorMessage from './ErrorMessage';
import { useFormState } from './hooks/useFormState';
import Input from './Input';
import { useMutation } from './lib/graphql';

const authorAddMutation = /* GraphQL */ `
  mutation authorAdd($input: AuthorAddInput!) {
    authorAdd(input: $input) {
      author {
        id
        name
      }
    }
  }
`;

const AddAuthor = () => {
  const [formState, onChange] = useFormState({
    name: '',
  });

  const {
    mutate: addAuthor,
    loading: isSubmitting,
    error: authorAddError,
  } = useMutation('http://localhost:3010/graphql', authorAddMutation);

  if (authorAddError) {
    return <ErrorMessage>{authorAddError}</ErrorMessage>;
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault();

        addAuthor({
          variables: {
            input: formState,
          },
        });
      }}
    >
      <Heading color="grey.1" fontSize={2} mb={2}>
        Add author
      </Heading>
      <Flex flexDirection="row">
        <Input
          name="name"
          value={formState.name}
          onChange={onChange}
          placeholder="Author name"
          mr={3}
        />
        <Button bg="blue.4" disabled={isSubmitting}>
          Add
        </Button>
      </Flex>
    </form>
  );
};

export default AddAuthor;
