/** @jsx jsx */
import { jsx, Flex } from 'theme-ui';
import Button from './Button';
import ErrorMessage from './ErrorMessage';
import Heading from './Heading';
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
      <Heading sx={{ color: 'grey.1', fontSize: 2, mb: 2 }}>Add author</Heading>
      <Flex sx={{ flexDirection: 'row' }}>
        <Input
          name="name"
          value={formState.name}
          onChange={onChange}
          placeholder="Author name"
          sx={{ mr: 3 }}
        />
        <Button sx={{ bg: 'blue.4' }} disabled={isSubmitting}>
          Add
        </Button>
      </Flex>
    </form>
  );
};

export default AddAuthor;
