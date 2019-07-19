/** @jsx jsx */
import { jsx, Flex } from 'theme-ui';
import Heading from './Heading';
import Nav from './Nav';

const Container = props => {
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center', p: 3 }}>
        <Heading sx={{ width: '100%' }}>{props.title}</Heading>
        <Nav />
      </Flex>
      {props.children}
    </Flex>
  );
};

export default Container;
