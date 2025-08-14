import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  VideoCall,
  CloudUpload,
  Analytics,
  Settings,
  Add,
  MoreVert,
  PlayArrow,
  Download,
  Share
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Mock data for demonstration
  const stats = {
    videosProcessed: user?.totalVideosProcessed || 0,
    videosThisMonth: user?.videosProcessedThisMonth || 0,
    remainingQuota: user?.getRemainingQuota?.() || 5,
    storageUsed: user?.storageUsed || 0
  };

  const recentVideos = [
    {
      id: 1,
      title: 'Apresentação do Produto',
      duration: '2:30',
      status: 'completed',
      createdAt: '2024-01-15',
      thumbnail: '/api/placeholder/160/90'
    },
    {
      id: 2,
      title: 'Tutorial de Marketing',
      duration: '1:45',
      status: 'processing',
      createdAt: '2024-01-14',
      thumbnail: '/api/placeholder/160/90'
    },
    {
      id: 3,
      title: 'Reunião de Equipe',
      duration: '45:20',
      status: 'completed',
      createdAt: '2024-01-13',
      thumbnail: '/api/placeholder/160/90'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return t('completed');
      case 'processing': return t('processing');
      case 'failed': return t('failed');
      default: return t('pending');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('welcomeBack')}, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboardSubtitle')}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <VideoCall />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {stats.videosProcessed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('totalVideos')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Analytics />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {stats.videosThisMonth}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('thisMonth')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <CloudUpload />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {stats.remainingQuota === Infinity ? '∞' : stats.remainingQuota}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('remaining')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Settings />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {user?.subscriptionPlan?.toUpperCase() || 'FREE'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('currentPlan')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {t('quickActions')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Add />}
                    sx={{ py: 2 }}
                  >
                    {t('newVideo')}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUpload />}
                    sx={{ py: 2 }}
                  >
                    {t('uploadVideo')}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Analytics />}
                    sx={{ py: 2 }}
                  >
                    {t('viewAnalytics')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {t('monthlyUsage')}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {stats.videosThisMonth} / {stats.remainingQuota === Infinity ? '∞' : stats.videosThisMonth + stats.remainingQuota}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.remainingQuota === Infinity ? '100%' : `${Math.round((stats.videosThisMonth / (stats.videosThisMonth + stats.remainingQuota)) * 100)}%`}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.remainingQuota === Infinity ? 100 : (stats.videosThisMonth / (stats.videosThisMonth + stats.remainingQuota)) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('upgradeForMore')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Videos */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              {t('recentVideos')}
            </Typography>
            <Button variant="outlined" size="small">
              {t('viewAll')}
            </Button>
          </Box>

          {recentVideos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <VideoCall sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t('noVideosYet')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('startByUploading')}
              </Typography>
              <Button variant="contained" startIcon={<Add />}>
                {t('uploadFirstVideo')}
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {recentVideos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card variant="outlined">
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 120,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 40, color: 'grey.600' }} />
                      </Box>
                      <Chip
                        label={getStatusText(video.status)}
                        color={getStatusColor(video.status)}
                        size="small"
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      />
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={handleMenuClick}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ pb: 1 }}>
                      <Typography variant="subtitle2" noWrap gutterBottom>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {video.duration} • {video.createdAt}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                        <IconButton size="small">
                          <Share />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>{t('edit')}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{t('download')}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{t('share')}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{t('delete')}</MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
