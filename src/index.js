import React from "react";
import { render } from "react-dom";
import DevTools from "mobx-react-devtools";
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchApp from "./components/SearchApp";

const GlobalApp = () => (
  <MuiThemeProvider>
    <SearchApp />
  </MuiThemeProvider>
);

ReactDOM.render(
  <GlobalApp />,
  document.getElementById('root')
);

