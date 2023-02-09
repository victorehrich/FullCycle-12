import { CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { Mapping } from './components/Mapping';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>
      <Mapping></Mapping>
    </ThemeProvider>
  );
}

export default App;
