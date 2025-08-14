import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CloudUpload,
  VideoFile,
  Close,
  PlayArrow,
  Settings,
  Download
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

const VideoUpload = () => {
  const { t } = useTranslation();
  const { user } = useSelector(state => state.auth);
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [processingSettings, setProcessingSettings] = useState({
    platform: 'tiktok',
    quality: '1080p',
    duration: 'auto'
  });

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      status: 'ready', // ready, uploading, processing, completed, error
      progress: 0,
      url: URL.createObjectURL(file)
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: true
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const startProcessing = async (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    // Update file status
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, status: 'uploading' } : f)
    );

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      
      if (progress === 100) {
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f)
        );
        
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, status: 'completed' } : f)
        );
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'default';
      case 'uploading': return 'info';
      case 'processing': return 'warning';
      case 'completed': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ready': return t('ready');
      case 'uploading': return t('uploading');
      case 'processing': return t('processing');
      case 'completed': return t('completed');
      case 'error': return t('error');
      default: return t('unknown');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canUpload = user?.canProcessVideo?.() !== false;
  const remainingQuota = user?.getRemainingQuota?.() || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('uploadVideo')} 🎬
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('uploadVideoSubtitle')}
        </Typography>
      </Box>

      {/* Quota Warning */}
      {!canUpload && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t('quotaExceeded')} {t('upgradeToUploadMore')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Upload Area */}
        <Grid item xs={12} md={8}>
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              cursor: canUpload ? 'pointer' : 'not-allowed',
              opacity: canUpload ? 1 : 0.6,
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <input {...getInputProps()} disabled={!canUpload} />
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? t('dropFilesHere') : t('dragDropFiles')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('supportedFormats')}: MP4, AVI, MOV, MKV, WebM
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('maxFileSize')}: 500MB
            </Typography>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              disabled={!canUpload}
            >
              {t('selectFiles')}
            </Button>
          </Paper>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('uploadedFiles')} ({uploadedFiles.length})
              </Typography>
              {uploadedFiles.map((file) => (
                <Card key={file.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VideoFile sx={{ mr: 2, color: 'primary.main' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" noWrap>
                          {file.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(file.status)}
                        color={getStatusColor(file.status)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === 'uploading' || file.status === 'processing'}
                      >
                        <Close />
                      </IconButton>
                    </Box>

                    {/* Progress Bar */}
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress[file.id] || 0}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {file.status === 'uploading' ? t('uploading') : t('processing')}... {uploadProgress[file.id] || 0}%
                        </Typography>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {file.status === 'ready' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => startProcessing(file.id)}
                        >
                          {t('startProcessing')}
                        </Button>
                      )}
                      {file.status === 'completed' && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Download />}
                        >
                          {t('download')}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Settings Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {t('processingSettings')}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('targetPlatform')}</InputLabel>
                <Select
                  value={processingSettings.platform}
                  label={t('targetPlatform')}
                  onChange={(e) => setProcessingSettings(prev => ({ ...prev, platform: e.target.value }))}
                >
                  <MenuItem value="tiktok">TikTok (9:16)</MenuItem>
                  <MenuItem value="instagram-reels">Instagram Reels (9:16)</MenuItem>
                  <MenuItem value="youtube-shorts">YouTube Shorts (9:16)</MenuItem>
                  <MenuItem value="instagram-post">Instagram Post (1:1)</MenuItem>
                  <MenuItem value="youtube">YouTube (16:9)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('quality')}</InputLabel>
                <Select
                  value={processingSettings.quality}
                  label={t('quality')}
                  onChange={(e) => setProcessingSettings(prev => ({ ...prev, quality: e.target.value }))}
                >
                  <MenuItem value="480p">480p</MenuItem>
                  <MenuItem value="720p">720p</MenuItem>
                  <MenuItem value="1080p">1080p</MenuItem>
                  <MenuItem value="4k">4K</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label={t('maxDuration')}
                value={processingSettings.duration}
                onChange={(e) => setProcessingSettings(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="60s"
                helperText={t('leaveEmptyForAuto')}
                sx={{ mb: 2 }}
              />

              {/* Usage Info */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('currentUsage')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('videosThisMonth')}: {user?.videosProcessedThisMonth || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('remaining')}: {remainingQuota === Infinity ? '∞' : remainingQuota}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('plan')}: {user?.subscriptionPlan?.toUpperCase() || 'FREE'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoUpload;
