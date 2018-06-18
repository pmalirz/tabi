import 'babel-polyfill';
import { ConfigPanel } from './config-panel';
import App from 'grommet/components/App';

import 'grommet/scss/hpinc/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

// main application element
const app = document.getElementById('app');

ReactDOM.render(
    <App><ConfigPanel /></App>,
    app
);
