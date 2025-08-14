import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Slider,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  Fullscreen,
  ContentCut,
  Download,
  Share,
  Undo,
  Redo,
  Add,
  Delete
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const VideoEditor = () => {
  const { t } = useTranslation();
  const { videoId } = useParams();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // 2 minutes
  const [volume, setVolume] = useState(50);
  const [selectedClip, setSelectedClip] = useState(null);
  
  // Mock video data
  const videoData = {
    id: videoId,
    title: 'Apresentação do Produto',
    originalDuration: 120,
    clips: [
      { id: 1, start: 0, end: 30, title: 'Introdução', platform: 'tiktok' },
      { id: 2, start: 30, end: 60, title: 'Demonstração', platform: 'instagram-reels' },
      { id: 3, start: 60, end: 90, title: 'Benefícios', platform: 'youtube-shorts' }
    ]
  };

  const [clips, setClips] = useState(videoData.clips);
  const [newClip, setNewClip] = useState({ start: 0, end: 30, title: '', platform: 'tiktok' });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (event, newValue) => {
    setCurrentTime(newValue);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addClip = () => {
    if (newClip.title && newClip.start < newClip.end) {
      const clip = {
        id: Date.now(),
        ...newClip
      };
      setClips([...clips, clip]);
      setNewClip({ start: 0, end: 30, title: '', platform: 'tiktok' });
    }
  };

  const deleteClip = (clipId) => {
    setClips(clips.filter(clip => clip.id !== clipId));
  };

  const selectClip = (clip) => {
    setSelectedClip(clip);
    setCurrentTime(clip.start);
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'tiktok': return '#000000';
      case 'instagram-reels': return '#E4405F';
      case 'youtube-shorts': return '#FF0000';
      case 'instagram-post': return '#405DE6';
      default: return '#1976d2';
    }
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case 'tiktok': return 'TikTok';
      case 'instagram-reels': return 'Instagram Reels';
      case 'youtube-shorts': return 'YouTube Shorts';
      case 'instagram-post': return 'Instagram Post';
      default: return platform;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {t('videoEditor')} - {videoData.title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Video Player */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2 }}>
            {/* Video Display */}
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                borderRadius: 1
              }}
            >
              <Typography variant="h6" color="white">
                {t('videoPreview')}
              </Typography>
            </Box>

            {/* Video Controls */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handlePlayPause} size="large">
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton>
                  <Stop />
                </IconButton>
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                  <Slider
                    value={currentTime}
                    onChange={handleTimeChange}
                    min={0}
                    max={duration}
                    valueLabelDisplay="auto"
                    valueLabelFormat={formatTime}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <VolumeUp />
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  sx={{ width: 100 }}
                />
                <IconButton>
                  <Fullscreen />
                </IconButton>
              </Box>
            </Box>

            {/* Timeline */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('timeline')}
              </Typography>
              <Box
                sx={{
                  height: 60,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {clips.map((clip) => (
                  <Box
                    key={clip.id}
                    onClick={() => selectClip(clip)}
                    sx={{
                      position: 'absolute',
                      left: `${(clip.start / duration) * 100}%`,
                      width: `${((clip.end - clip.start) / duration) * 100}%`,
                      height: '100%',
                      bgcolor: getPlatformColor(clip.platform),
                      opacity: selectedClip?.id === clip.id ? 1 : 0.7,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      border: selectedClip?.id === clip.id ? '2px solid white' : 'none'
                    }}
                  >
                    {clip.title}
                  </Box>
                ))}
                
                {/* Current Time Indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${(currentTime / duration) * 100}%`,
                    width: 2,
                    height: '100%',
                    bgcolor: 'red',
                    zIndex: 10
                  }}
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button startIcon={<Undo />} variant="outlined" size="small">
                {t('undo')}
              </Button>
              <Button startIcon={<Redo />} variant="outlined" size="small">
                {t('redo')}
              </Button>
              <Button startIcon={<ContentCut />} variant="outlined" size="small">
                {t('cut')}
              </Button>
              <Button startIcon={<Download />} variant="contained" size="small">
                {t('export')}
              </Button>
              <Button startIcon={<Share />} variant="outlined" size="small">
                {t('share')}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Clips Panel */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('clips')} ({clips.length})
              </Typography>
              
              {clips.map((clip) => (
                <Box
                  key={clip.id}
                  onClick={() => selectClip(clip)}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: 1,
                    borderColor: selectedClip?.id === clip.id ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: selectedClip?.id === clip.id ? 'action.selected' : 'transparent'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">{clip.title}</Typography>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); deleteClip(clip.id); }}>
                      <Delete />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(clip.start)} - {formatTime(clip.end)}
                  </Typography>
                  <Chip
                    label={getPlatformName(clip.platform)}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: getPlatformColor(clip.platform),
                      color: 'white'
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Add New Clip */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('addNewClip')}
              </Typography>
              
              <TextField
                fullWidth
                label={t('clipTitle')}
                value={newClip.title}
                onChange={(e) => setNewClip({ ...newClip, title: e.target.value })}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('startTime')}
                    type="number"
                    value={newClip.start}
                    onChange={(e) => setNewClip({ ...newClip, start: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 0, max: duration }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('endTime')}
                    type="number"
                    value={newClip.end}
                    onChange={(e) => setNewClip({ ...newClip, end: parseInt(e.target.value) || 30 })}
                    inputProps={{ min: 0, max: duration }}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('platform')}</InputLabel>
                <Select
                  value={newClip.platform}
                  label={t('platform')}
                  onChange={(e) => setNewClip({ ...newClip, platform: e.target.value })}
                >
                  <MenuItem value="tiktok">TikTok</MenuItem>
                  <MenuItem value="instagram-reels">Instagram Reels</MenuItem>
                  <MenuItem value="youtube-shorts">YouTube Shorts</MenuItem>
                  <MenuItem value="instagram-post">Instagram Post</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={addClip}
                disabled={!newClip.title || newClip.start >= newClip.end}
              >
                {t('addClip')}
              </Button>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('exportSettings')}
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('quality')}</InputLabel>
                <Select defaultValue="1080p">
                  <MenuItem value="480p">480p</MenuItem>
                  <MenuItem value="720p">720p</MenuItem>
                  <MenuItem value="1080p">1080p</MenuItem>
                  <MenuItem value="4k">4K</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('format')}</InputLabel>
                <Select defaultValue="mp4">
                  <MenuItem value="mp4">MP4</MenuItem>
                  <MenuItem value="mov">MOV</MenuItem>
                  <MenuItem value="webm">WebM</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Download />}
                disabled={clips.length === 0}
              >
                {t('exportAllClips')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoEditor;
