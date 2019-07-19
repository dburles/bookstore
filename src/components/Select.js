/** @jsx jsx */
import { jsx } from 'theme-ui';

const Select = props => {
  return (
    <select
      sx={{
        fontSize: 1,
      }}
      {...props}
    />
  );
};

export default Select;
