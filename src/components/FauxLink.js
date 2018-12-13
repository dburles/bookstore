import { Text } from 'rebass';
import styled from 'styled-components';

const FauxLink = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
`;

FauxLink.defaultProps = {
  color: 'base',
};

export default FauxLink;
