import React, { createContext, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const App = () => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#3b82f6',
            light: mode === 'light' ? '#60a5fa' : '#2563eb',
            dark: mode === 'light' ? '#2563eb' : '#1d4ed8',
          },
          secondary: {
            main: '#10b981',
            light: mode === 'light' ? '#34d399' : '#059669',
            dark: mode === 'light' ? '#059669' : '#047857',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
          text: {
            primary: mode === 'light' ? '#1a1a1a' : '#f1f5f9',
            secondary: mode === 'light' ? '#4b5563' : '#94a3b8',
          },
          action: {
            active: mode === 'light' ? '#4b5563' : '#94a3b8',
            hover: mode === 'light' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.15)',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: mode === 'light' ? "#8885" : "#fff3",
                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                  width: 8,
                  height: 8,
                  backgroundColor: mode === 'light' ? "#f1f5f9" : "#1e293b",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  borderRadius: 8,
                  backgroundColor: mode === 'light' ? "#8885" : "#fff3",
                  border: "2px solid transparent",
                  backgroundClip: "content-box",
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: mode === 'light' ? '#4b5563' : '#94a3b8',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

export default App; 