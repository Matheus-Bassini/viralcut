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
  CircularProgress
} from '@mui/material';
import { ArrowBack, Email } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError('');
    }
    if (error) {
      setError('');
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setValidationError(t('emailRequired'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError(t('emailInvalid'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      // TODO: Implement forgot password API call
      // const result = await dispatch(forgotPassword({ email })).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
    } catch (error) {
      setError(error.message || t('forgotPasswordError'));
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = async () => {
    try {
      // TODO: Implement resend email API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('');
      // Show success message or update UI
    } catch (error) {
      setError(t('resendEmailError'));
    }
  };

  if (emailSent) {
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
            {/* Success Icon */}
            <Box sx={{ mb: 3 }}>
              <Email sx={{ fontSize: 64, color: '#4caf50' }} />
            </Box>

            {/* Header */}
            <Typography variant="h4" component="h1" gutterBottom>
              {t('checkYourEmail')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('passwordResetEmailSent', { email })}
            </Typography>

            {/* Instructions */}
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body2" gutterBottom>
                {t('emailInstructions')}:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>{t('checkInboxAndSpam')}</li>
                <li>{t('clickResetLink')}</li>
                <li>{t('linkExpiresIn24Hours')}</li>
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleResendEmail}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <Email />}
              >
                {isLoading ? t('sending') : t('resendEmail')}
              </Button>
              
              <Button
                variant="contained"
                onClick={handleBackToLogin}
                startIcon={<ArrowBack />}
              >
                {t('backToLogin')}
              </Button>
            </Box>

            {/* Additional Help */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" color="text.secondary">
                {t('didntReceiveEmail')}{' '}
                <Link href="mailto:support@viralcutpro.com" underline="hover">
                  {t('contactSupport')}
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

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
          {/* Back Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBackToLogin}
              sx={{ textTransform: 'none' }}
            >
              {t('backToLogin')}
            </Button>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              🎬 ViralCut Pro
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('forgotPassword')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('forgotPasswordSubtitle')}
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
            <TextField
              required
              fullWidth
              id="email"
              label={t('email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleChange}
              error={!!validationError}
              helperText={validationError || t('enterEmailForReset')}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Email />}
            >
              {isLoading ? t('sending') : t('sendResetLink')}
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
            {t('forgotPasswordHelpText')}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
