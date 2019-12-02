/** @jsx jsx */
import { jsx } from 'theme-ui';

const Select = props => {
  return (
    <select
      {...props}
      sx={{
        fontSize: 1,
      }}
    />
  );
};

export default Select;
