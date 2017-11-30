import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SearchApp from "./SearchApp";
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const GlobalApp = () => (
    <MuiThemeProvider>
      <SearchApp />
    </MuiThemeProvider>
);

ReactDOM.render(<GlobalApp />, document.getElementById('root'));
registerServiceWorker();
