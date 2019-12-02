/** @jsx jsx */
import { Global } from '@emotion/core';
import { jsx, css } from 'theme-ui';

const GlobalStyle = () => (
  <Global
    styles={css({
      body: {
        backgroundColor: 'grey.0',
        fontFamily: 'body',
        lineHeight: '1.5',
      },
      a: {
        color: 'primary',
      },
      'body, form': {
        margin: 0,
        padding: 0,
      },
    })}
  />
);

export default GlobalStyle;
