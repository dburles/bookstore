/** @jsx jsx */
import { jsx, Flex } from 'theme-ui';
import Button from './Button';
import ErrorMessage from './ErrorMessage';
import Heading from './Heading';
import { useFormState } from './hooks/useFormState';
import Input from './Input';
import { useMutation, useQuery } from './lib/graphql';
import Select from './Select';

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

const AddBook = () => {
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
            input: { ...formState, authorId: Number(formState.authorId) },
          },
        });
      }}
    >
      <Heading sx={{ color: 'grey.1', fontSize: 2, mb: 2 }}>Add book</Heading>
      <Flex sx={{ flexDirection: 'row' }}>
        <Select onChange={onChange} name="authorId">
          <option value="">Select Author</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </Select>
        <Input
          name="title"
          value={formState.title}
          onChange={onChange}
          placeholder="Book title"
          sx={{ mx: 3 }}
        />
        <Button
          sx={{ bg: 'blue.4' }}
          disabled={!formState.authorId || isSubmitting}
        >
          Add
        </Button>
      </Flex>
    </form>
  );
};

export default AddBook;
