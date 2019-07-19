/** @jsx jsx */
import { jsx } from 'theme-ui';

const Label = props => {
  return (
    <label
      sx={{
        display: 'block',
        fontWeight: 'bold',
        color: 'grey.1',
        fontSize: 2,
        mb: 2,
      }}
      {...props}
    />
  );
};

export default Label;
