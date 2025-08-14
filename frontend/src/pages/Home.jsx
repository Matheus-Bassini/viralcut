import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Chip,
  Stack
} from '@mui/material';
import { 
  VideoCall, 
  AutoAwesome, 
  Speed, 
  Security,
  Language,
  CloudUpload
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const features = [
    {
      icon: <AutoAwesome sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('aiPoweredCutting'),
      description: t('aiPoweredCuttingDesc')
    },
    {
      icon: <VideoCall sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('multiPlatformOptimization'),
      description: t('multiPlatformOptimizationDesc')
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('fastProcessing'),
      description: t('fastProcessingDesc')
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('secureAndPrivate'),
      description: t('secureAndPrivateDesc')
    },
    {
      icon: <Language sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('multiLanguage'),
      description: t('multiLanguageDesc')
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: t('cloudBased'),
      description: t('cloudBasedDesc')
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: t('free'),
      videos: '5',
      features: [
        t('basicEditing'),
        t('standardQuality'),
        t('watermark')
      ],
      color: '#757575'
    },
    {
      name: 'Pro',
      price: 'R$ 29,90/mês',
      videos: '50',
      features: [
        t('advancedEditing'),
        t('hdQuality'),
        t('noWatermark'),
        t('prioritySupport')
      ],
      color: '#1976d2',
      popular: true
    },
    {
      name: 'Business',
      price: 'R$ 79,90/mês',
      videos: '200',
      features: [
        t('allProFeatures'),
        t('4kQuality'),
        t('batchProcessing'),
        t('apiAccess')
      ],
      color: '#388e3c'
    },
    {
      name: 'Sacred',
      price: 'R$ 199,90/mês',
      videos: t('unlimited'),
      features: [
        t('allBusinessFeatures'),
        t('customBranding'),
        t('dedicatedSupport'),
        t('advancedAnalytics')
      ],
      color: '#f57c00'
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            🎬 {t('heroTitle')}
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            {t('heroSubtitle')}
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              {t('getStarted')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {t('watchDemo')}
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            <Chip label="TikTok" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="Instagram" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="YouTube" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="Kwai" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          {t('featuresTitle')}
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          {t('featuresSubtitle')}
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            {t('pricingTitle')}
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            {t('pricingSubtitle')}
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    position: 'relative',
                    border: plan.popular ? `2px solid ${plan.color}` : 'none',
                    transform: plan.popular ? 'scale(1.05)' : 'none'
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label={t('mostPopular')}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: plan.color,
                        color: 'white'
                      }}
                    />
                  )}
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" component="p" sx={{ color: plan.color, mb: 2 }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {plan.videos} {t('videosPerMonth')}
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <Typography key={featureIndex} variant="body2">
                          ✓ {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={plan.popular ? 'contained' : 'outlined'}
                      sx={{
                        backgroundColor: plan.popular ? plan.color : 'transparent',
                        borderColor: plan.color,
                        color: plan.popular ? 'white' : plan.color,
                        '&:hover': {
                          backgroundColor: plan.color,
                          color: 'white'
                        }
                      }}
                      onClick={handleGetStarted}
                    >
                      {t('choosePlan')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            {t('ctaTitle')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {t('ctaSubtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{ px: 4, py: 1.5 }}
          >
            {t('startCreating')}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
