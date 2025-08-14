import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { CheckCircle, Email, Error, Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { isLoading, user } = useSelector(state => state.auth);

  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const token = searchParams.get('token');
  const email = location.state?.email || user?.email || '';

  useEffect(() => {
    if (token) {
      // Verify email with token
      verifyEmailToken(token);
    } else if (user?.isEmailVerified) {
      // User is already verified, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  const verifyEmailToken = async (verificationToken) => {
    try {
      // TODO: Implement email verification API call
      // const result = await dispatch(verifyEmail({ token: verificationToken })).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus('success');
    } catch (error) {
      setVerificationStatus('error');
      setError(error.message || t('emailVerificationFailed'));
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError(t('emailNotFound'));
      return;
    }

    setResendLoading(true);
    try {
      // TODO: Implement resend verification API call
      // await dispatch(resendVerification({ email })).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setError('');
      // Show success message or update UI
    } catch (error) {
      setError(error.message || t('resendVerificationFailed'));
    } finally {
      setResendLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Success state
  if (verificationStatus === 'success') {
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
            <Typography variant="h4" component="h1" gutterBottom>
              {t('emailVerified')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('emailVerificationSuccess')}
            </Typography>
            <Button
              variant="contained"
              onClick={handleContinue}
              size="large"
              sx={{ px: 4 }}
            >
              {t('continueToDashboard')}
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Error state
  if (verificationStatus === 'error') {
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
              {t('verificationFailed')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error || t('verificationLinkInvalid')}
            </Typography>
            
            {email && (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  startIcon={resendLoading ? <CircularProgress size={20} /> : <Refresh />}
                  sx={{ mr: 2 }}
                >
                  {resendLoading ? t('sending') : t('resendVerification')}
                </Button>
              </Box>
            )}
            
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

  // Pending/Loading state (default)
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
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              🎬 ViralCut Pro
            </Typography>
            {token ? (
              <>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  {t('verifyingEmail')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('pleaseWaitVerifying')}
                </Typography>
              </>
            ) : (
              <>
                <Email sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  {t('verifyYourEmail')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {email ? t('verificationEmailSent', { email }) : t('checkEmailForVerification')}
                </Typography>
              </>
            )}
          </Box>

          {!token && (
            <>
              {/* Instructions */}
              <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2" gutterBottom>
                  {t('verificationInstructions')}:
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>{t('checkInboxAndSpam')}</li>
                  <li>{t('clickVerificationLink')}</li>
                  <li>{t('returnToCompleteSetup')}</li>
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
                {email && (
                  <Button
                    variant="outlined"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    startIcon={resendLoading ? <CircularProgress size={20} /> : <Email />}
                  >
                    {resendLoading ? t('sending') : t('resendVerification')}
                  </Button>
                )}
                
                <Button
                  variant="contained"
                  onClick={handleBackToLogin}
                >
                  {t('backToLogin')}
                </Button>
              </Box>

              {/* Additional Help */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('needHelp')}{' '}
                  <Typography
                    component="a"
                    href="mailto:support@viralcutpro.com"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    {t('contactSupport')}
                  </Typography>
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
