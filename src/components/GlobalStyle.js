/** @jsx jsx */
import { Global, css } from '@emotion/core';
import { jsx } from 'theme-ui';

const GlobalStyle = () => (
  <Global
    styles={theme => css`
      body {
        background: ${theme.colors.grey[0]};
        font-family: ${theme.fonts.body};
        line-height: 1.5;
      }
      a {
        color: ${theme.colors.base};
      }
      body,
      form {
        margin: 0;
        padding: 0;
      }
    `}
  />
);

export default GlobalStyle;
