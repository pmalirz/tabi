import { ConfigPanel } from './config-panel';
import { Grommet } from 'grommet';

import React from 'react';
import ReactDOM from 'react-dom';

// main application element
const app = document.getElementById('app');

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

const App = props => (
    <Grommet theme={theme}>
      <ConfigPanel />
    </Grommet>
  );

ReactDOM.render(
    <App />,
    app
);
