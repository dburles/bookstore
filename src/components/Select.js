import styled from 'styled-components';
import { space, width, fontSize } from 'styled-system';

const Select = styled.select`
  ${space}
  ${width}
  ${fontSize}
  height: 40px;
`;

Select.defaultProps = {
  fontSize: 1,
};

export default Select;
