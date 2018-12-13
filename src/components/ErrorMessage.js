import PropTypes from 'prop-types';
import React from 'react';
import { Box, Text } from 'rebass';

const ErrorMessage = props => {
  return (
    <Box m={3} py={3} px={5} bg="red.6" color="white">
      <Text fontWeight="bold">{props.children}</Text>
    </Box>
  );
};

ErrorMessage.propTypes = {};

export default ErrorMessage;
