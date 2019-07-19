/** @jsx jsx */
import { css, keyframes } from '@emotion/core';
import { jsx } from 'theme-ui';

const spinner = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = ({ fullScreen, ...props }) => {
  return (
    <div
      css={css`
        &:before {
          position: absolute;
          top: 50%;
          ${fullScreen ? 'left: 50%' : 'right: 0'};
          content: '';
          box-sizing: border-box;
          width: ${fullScreen ? '40' : '20'}px;
          height: ${fullScreen ? '40' : '20'}px;
          margin-top: -${fullScreen ? '20' : '10'}px;
          margin-left: -${fullScreen ? '20' : '10'}px;
          border-radius: 50%;
          border: 3px solid #f6f;
          border-top-color: #0e0;
          border-right-color: #0dd;
          border-bottom-color: #f90;
          animation: ${spinner} 0.6s linear infinite;
        }
      `}
      {...props}
    />
  );
};

export default Spinner;
