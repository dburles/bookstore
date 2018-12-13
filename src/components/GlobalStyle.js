import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => props.theme.colors.grey[0]}
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    line-height: 1.5;
  }
  a {
    color: ${props => props.theme.colors.base};
  }
  body, form {
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyle;
