/** @jsx jsx */
import { jsx } from 'theme-ui';

const Label = props => {
  return (
    <label
      {...props}
      sx={{
        display: 'block',
        fontWeight: 'bold',
        color: 'grey.1',
        fontSize: 2,
        mb: 2,
      }}
    />
  );
};

export default Label;
