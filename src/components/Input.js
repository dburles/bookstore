/** @jsx jsx */
import { jsx } from 'theme-ui';

const Input = props => {
  return (
    <input
      type="text"
      sx={{
        fontSize: 1,
        px: 3,
        width: '100%',
        border: '1px solid',
        borderColor: 'grey.7',
        borderRadius: 4,
      }}
      {...props}
    />
  );
};

export default Input;
