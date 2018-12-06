import PropTypes from 'prop-types';
import React from 'react';
import { Box } from 'rebass';

const ErrorMessage = props => {
  return (
    <Box p={3} bg="red" color="white">
      {props.children}
    </Box>
  );
};

ErrorMessage.propTypes = {};

export default ErrorMessage;
