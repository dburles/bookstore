/** @jsx jsx */
import { jsx } from 'theme-ui';

const Button = props => {
  return (
    <button
      sx={{
        py: 2,
        px: 3,
        bg: 'primary',
        border: 'none',
        borderRadius: 3,
        color: 'white',
        fontSize: 2,
      }}
      {...props}
    />
  );
};

export default Button;
