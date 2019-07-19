import { storiesOf } from '@storybook/react';
import React from 'react';
import Books from './Books';

const BooksProps = {
  books: [],
};

storiesOf('Books', module).add('Default', () => <Books {...BooksProps} />);
