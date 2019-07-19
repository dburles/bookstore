/** @jsx jsx */
import { jsx } from 'theme-ui';
import Text from './Text';

const FauxLink = props => {
  return (
    <Text
      sx={{ color: 'base', textDecoration: 'underline', cursor: 'pointer' }}
      {...props}
    />
  );
};

export default FauxLink;
