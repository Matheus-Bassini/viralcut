import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingScreen from './components/UI/LoadingScreen';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';
import Dashboard from './pages/Dashboard/Dashboard';
import VideoUpload from './pages/Video/VideoUpload';
import VideoEditor from './pages/Video/VideoEditor';
import VideoLibrary from './pages/Video/VideoLibrary';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Pricing from './pages/Pricing/Pricing';
import NotFound from './pages/NotFound';

// Store
import { initializeAuth } from './store/slices/authSlice';
import { setLanguage } from './store/slices/uiSlice';

// Utils
import { getStoredLanguage } from './utils/language';

// Theme configuration
const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#667eea',
      light: '#8fa4f3',
      dark: '#4c63d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9575cd',
      dark: '#512da8',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
      paper: mode === 'dark' ? '#1a1a1a' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#333333',
      secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'dark' 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode, language } = useSelector((state) => state.ui);

  const theme = React.useMemo(() => createAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  useEffect(() => {
    // Initialize authentication state
    dispatch(initializeAuth());

    // Set initial language
    const storedLanguage = getStoredLanguage();
    if (storedLanguage && storedLanguage !== language) {
      dispatch(setLanguage(storedLanguage));
    }
  }, [dispatch, language]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
                } 
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<VideoUpload />} />
                  <Route path="/editor/:videoId" element={<VideoEditor />} />
                  <Route path="/library" element={<VideoLibrary />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Router>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
            },
            success: {
              iconTheme: {
                primary: theme.palette.success.main,
                secondary: theme.palette.success.contrastText,
              },
            },
            error: {
              iconTheme: {
                primary: theme.palette.error.main,
                secondary: theme.palette.error.contrastText,
              },
            },
          }}
        />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
