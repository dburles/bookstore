/** @jsx jsx */
import { jsx } from 'theme-ui';
import Text from './Text';

const ErrorMessage = props => {
  return (
    <div sx={{ m: 3, py: 3, px: 5, bg: 'red.6', color: 'white' }}>
      <Text sx={{ fontWeight: 'bold' }}>{props.children}</Text>
    </div>
  );
};

export default ErrorMessage;
