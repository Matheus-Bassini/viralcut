import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { isLoading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  const token = searchParams.get('token');

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setError(t('invalidResetLink'));
      setTokenValid(false);
      return;
    }

    // TODO: Implement token validation API call
    // For now, assume token is valid
    setTokenValid(true);
  }, [token, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};

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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implement reset password API call
      // const result = await dispatch(resetPassword({
      //   token,
      //   password: formData.password
      // })).unwrap();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
    } catch (error) {
      setError(error.message || t('resetPasswordError'));
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t('validatingResetLink')}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
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
          <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
            <Error sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom>
              {t('invalidResetLink')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('resetLinkExpiredOrInvalid')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/forgot-password')}
              sx={{ mr: 2 }}
            >
              {t('requestNewLink')}
            </Button>
            <Button
              variant="outlined"
              onClick={handleBackToLogin}
            >
              {t('backToLogin')}
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Success state
  if (success) {
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
          <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom>
              {t('passwordResetSuccess')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('passwordResetSuccessMessage')}
            </Typography>
            <Button
              variant="contained"
              onClick={handleBackToLogin}
              size="large"
            >
              {t('signIn')}
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Reset password form
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
              {t('resetPassword')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('resetPasswordSubtitle')}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Password Field */}
            <TextField
              required
              fullWidth
              name="password"
              label={t('newPassword')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              autoFocus
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
              label={t('confirmNewPassword')}
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
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {isLoading ? t('resetting') : t('resetPassword')}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2">
                {t('rememberPassword')}{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  {t('signIn')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Additional Info */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('resetPasswordHelpText')}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
