import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Mapping } from './components/Mapping';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
      <CssBaseline></CssBaseline>
      <Mapping></Mapping>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
