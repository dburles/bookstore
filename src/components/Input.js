import styled from 'styled-components';
import {
  space,
  width,
  fontSize,
  border,
  borderRadius,
  borderColor,
} from 'styled-system';

const Input = styled.input`
  ${space}
  ${width}
  ${fontSize}
  ${border}
  ${borderColor}
  ${borderRadius}
  height: 40px;
`;

Input.defaultProps = {
  fontSize: 1,
  px: 3,
  width: 1,
  type: 'text',
  border: '1px solid',
  borderColor: 'grey.7',
  borderRadius: 4,
};

export default Input;
