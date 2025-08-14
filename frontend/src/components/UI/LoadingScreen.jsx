import React from 'react';
import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoadingScreen = ({ 
  message, 
  progress, 
  showProgress = false,
  fullScreen = true 
}) => {
  const { t } = useTranslation();

  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    gap: 3
  } : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    gap: 3
  };

  return (
    <Box sx={containerStyles}>
      {/* Logo/Brand */}
      <Typography 
        variant="h4" 
        component="div" 
        sx={{ 
          fontWeight: 'bold',
          color: '#1976d2',
          mb: 2
        }}
      >
        🎬 ViralCut Pro
      </Typography>

      {/* Loading Spinner */}
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ color: '#1976d2' }}
      />

      {/* Loading Message */}
      <Typography 
        variant="h6" 
        color="text.primary"
        textAlign="center"
        sx={{ maxWidth: '300px' }}
      >
        {message || t('loading')}
      </Typography>

      {/* Progress Bar (if enabled) */}
      {showProgress && (
        <Box sx={{ width: '300px', mt: 2 }}>
          <LinearProgress 
            variant={progress !== undefined ? "determinate" : "indeterminate"}
            value={progress}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1976d2'
              }
            }}
          />
          {progress !== undefined && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              textAlign="center"
              sx={{ mt: 1 }}
            >
              {Math.round(progress)}%
            </Typography>
          )}
        </Box>
      )}

      {/* Additional Info */}
      <Typography 
        variant="body2" 
        color="text.secondary"
        textAlign="center"
        sx={{ maxWidth: '400px', mt: 1 }}
      >
        {t('pleaseWait')}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
