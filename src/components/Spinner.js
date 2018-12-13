import styled from 'styled-components';

const Spinner = styled.div`
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  &:before {
    position: absolute;
    top: 50%;
    ${props => (props.full ? 'left: 50%' : 'right: 0')};
    content: '';
    box-sizing: border-box;
    width: ${props => (props.full ? '40' : '20')}px;
    height: ${props => (props.full ? '40' : '20')}px;
    margin-top: -${props => (props.full ? '20' : '10')}px;
    margin-left: -${props => (props.full ? '20' : '10')}px;
    border-radius: 50%;
    border: 3px solid #f6f;
    border-top-color: #0e0;
    border-right-color: #0dd;
    border-bottom-color: #f90;
    animation: spinner 0.6s linear infinite;
  }
`;

export default Spinner;
