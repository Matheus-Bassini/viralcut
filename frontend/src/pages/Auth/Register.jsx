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
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'acceptTerms' ? checked : value
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

    if (!formData.firstName.trim()) {
      errors.firstName = t('firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      errors.lastName = t('lastNameRequired');
    }

    if (!formData.email.trim()) {
      errors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('passwordRequired');
    } else if (formData.password.length < 8) {
      errors.password = t('passwordTooShort');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      errors.password = t('passwordWeak');
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = t('confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('passwordsDoNotMatch');
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = t('acceptTermsRequired');
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
      const result = await dispatch(register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })).unwrap();

      // Registration successful
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          message: t('registrationSuccessful')
        }
      });
    } catch (error) {
      // Error is handled by the slice
      console.error('Registration failed:', error);
    }
  };

  const handleSocialLogin = (provider) => {
    // TODO: Implement social login
    console.log(`Login with ${provider}`);
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
              {t('createAccount')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('registerSubtitle')}
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
              {t('orRegisterWith')}
            </Typography>
          </Divider>

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Name Fields */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                label={t('firstName')}
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!validationErrors.firstName}
                helperText={validationErrors.firstName}
                disabled={isLoading}
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label={t('lastName')}
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!validationErrors.lastName}
                helperText={validationErrors.lastName}
                disabled={isLoading}
              />
            </Box>

            {/* Email Field */}
            <TextField
              required
              fullWidth
              id="email"
              label={t('email')}
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password || t('passwordRequirements')}
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

            {/* Confirm Password Field */}
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label={t('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Terms and Conditions */}
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  color="primary"
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant="body2">
                  {t('iAgreeToThe')}{' '}
                  <Link component={RouterLink} to="/terms" target="_blank">
                    {t('termsOfService')}
                  </Link>{' '}
                  {t('and')}{' '}
                  <Link component={RouterLink} to="/privacy" target="_blank">
                    {t('privacyPolicy')}
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            {validationErrors.acceptTerms && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {validationErrors.acceptTerms}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {isLoading ? t('creating') : t('createAccount')}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                {t('alreadyHaveAccount')}{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  {t('signIn')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
