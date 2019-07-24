/** @jsx jsx */
import { jsx } from 'theme-ui';

const Heading = props => {
  return <h1 {...props} sx={{ fontFamily: 'body' }} />;
};

export default Heading;
