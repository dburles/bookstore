import styled from 'styled-components';
import { space, width, fontSize } from 'styled-system';

const Input = styled.input`
  ${space}
  ${width}
  ${fontSize}
  height: 40px;
`;

Input.defaultProps = {
  fontSize: 1,
  px: 3,
  width: 1,
  type: 'text',
};

export default Input;
