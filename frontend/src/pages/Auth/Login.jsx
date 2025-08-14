import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('passwordRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      })).unwrap();

      // Login successful - redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the slice
      console.error('Login failed:', error);
    }
  };

  const handleSocialLogin = (provider) => {
    // TODO: Implement social login
    console.log(`Login with ${provider}`);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              🎬 ViralCut Pro
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('welcomeBack')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('loginSubtitle')}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Social Login Buttons */}
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('google')}
              sx={{ mb: 1 }}
            >
              {t('continueWithGoogle')}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('facebook')}
            >
              {t('continueWithFacebook')}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('orLoginWith')}
            </Typography>
          </Divider>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <TextField
              required
              fullWidth
              id="email"
              label={t('email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />

            {/* Password Field */}
            <TextField
              required
              fullWidth
              name="password"
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Remember Me & Forgot Password */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label={t('rememberMe')}
              />
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                type="button"
                sx={{ textDecoration: 'none' }}
              >
                {t('forgotPassword')}
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {isLoading ? t('signingIn') : t('signIn')}
            </Button>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                {t('dontHaveAccount')}{' '}
                <Link component={RouterLink} to="/register" variant="body2">
                  {t('createAccount')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Additional Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('loginHelpText')}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
