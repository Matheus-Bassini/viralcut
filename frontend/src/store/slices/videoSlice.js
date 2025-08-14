import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import videoAPI from '../../services/api/videoAPI';

const initialState = {
  videos: [],
  currentVideo: null,
  uploadProgress: {},
  processingStatus: {},
  filters: {
    status: 'all',
    category: 'all',
    platform: 'all',
    dateRange: 'all',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  uploadQueue: [],
  selectedVideos: [],
};

// Async thunks
export const uploadVideo = createAsyncThunk(
  'video/upload',
  async ({ file, metadata, onProgress }, { rejectWithValue, dispatch }) => {
    try {
      const response = await videoAPI.uploadVideo(file, metadata, (progress) => {
        dispatch(updateUploadProgress({ 
          fileId: file.name + file.size, 
          progress 
        }));
        if (onProgress) onProgress(progress);
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

export const fetchVideos = createAsyncThunk(
  'video/fetchVideos',
  async ({ page = 1, limit = 12, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideos({ page, limit, ...filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'video/fetchById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideoById(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video');
    }
  }
);

export const processVideo = createAsyncThunk(
  'video/process',
  async ({ videoId, options }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.processVideo(videoId, options);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Processing failed');
    }
  }
);

export const generateClips = createAsyncThunk(
  'video/generateClips',
  async ({ videoId, clipOptions }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.generateClips(videoId, clipOptions);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Clip generation failed');
    }
  }
);

export const downloadClip = createAsyncThunk(
  'video/downloadClip',
  async ({ videoId, clipId, quality }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.downloadClip(videoId, clipId, quality);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Download failed');
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/delete',
  async (videoId, { rejectWithValue }) => {
    try {
      await videoAPI.deleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

export const updateVideoMetadata = createAsyncThunk(
  'video/updateMetadata',
  async ({ videoId, metadata }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.updateVideoMetadata(videoId, metadata);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const importFromUrl = createAsyncThunk(
  'video/importFromUrl',
  async ({ url, platform }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.importFromUrl(url, platform);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Import failed');
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    // Upload management
    addToUploadQueue: (state, action) => {
      const fileData = {
        id: action.payload.file.name + action.payload.file.size,
        file: action.payload.file,
        metadata: action.payload.metadata,
        status: 'queued',
        progress: 0,
        error: null,
      };
      state.uploadQueue.push(fileData);
    },
    removeFromUploadQueue: (state, action) => {
      const fileId = action.payload;
      state.uploadQueue = state.uploadQueue.filter(item => item.id !== fileId);
      delete state.uploadProgress[fileId];
    },
    updateUploadProgress: (state, action) => {
      const { fileId, progress } = action.payload;
      state.uploadProgress[fileId] = progress;
      
      const queueItem = state.uploadQueue.find(item => item.id === fileId);
      if (queueItem) {
        queueItem.progress = progress;
        queueItem.status = progress === 100 ? 'completed' : 'uploading';
      }
    },
    setUploadError: (state, action) => {
      const { fileId, error } = action.payload;
      const queueItem = state.uploadQueue.find(item => item.id === fileId);
      if (queueItem) {
        queueItem.status = 'error';
        queueItem.error = error;
      }
    },
    clearUploadQueue: (state) => {
      state.uploadQueue = [];
      state.uploadProgress = {};
    },

    // Processing status
    updateProcessingStatus: (state, action) => {
      const { videoId, status, progress } = action.payload;
      state.processingStatus[videoId] = { status, progress };
      
      // Update video in list if it exists
      const video = state.videos.find(v => v._id === videoId);
      if (video) {
        video.status = status;
        video.processingProgress = progress;
      }
      
      // Update current video if it matches
      if (state.currentVideo && state.currentVideo._id === videoId) {
        state.currentVideo.status = status;
        state.currentVideo.processingProgress = progress;
      }
    },

    // Video selection
    selectVideo: (state, action) => {
      const videoId = action.payload;
      if (state.selectedVideos.includes(videoId)) {
        state.selectedVideos = state.selectedVideos.filter(id => id !== videoId);
      } else {
        state.selectedVideos.push(videoId);
      }
    },
    selectAllVideos: (state) => {
      state.selectedVideos = state.videos.map(video => video._id);
    },
    clearSelection: (state) => {
      state.selectedVideos = [];
    },

    // Filters and pagination
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },

    // Current video
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    updateCurrentVideoClips: (state, action) => {
      if (state.currentVideo) {
        state.currentVideo.generatedClips = action.payload;
      }
    },

    // Error handling
    clearError: (state) => {
      state.error = null;
    },

    // Real-time updates
    updateVideoInList: (state, action) => {
      const updatedVideo = action.payload;
      const index = state.videos.findIndex(v => v._id === updatedVideo._id);
      if (index !== -1) {
        state.videos[index] = { ...state.videos[index], ...updatedVideo };
      }
    },
    addVideoToList: (state, action) => {
      const newVideo = action.payload;
      const exists = state.videos.some(v => v._id === newVideo._id);
      if (!exists) {
        state.videos.unshift(newVideo);
      }
    },
    removeVideoFromList: (state, action) => {
      const videoId = action.payload;
      state.videos = state.videos.filter(v => v._id !== videoId);
      state.selectedVideos = state.selectedVideos.filter(id => id !== videoId);
      if (state.currentVideo && state.currentVideo._id === videoId) {
        state.currentVideo = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Video
      .addCase(uploadVideo.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        const newVideo = action.payload.video;
        state.videos.unshift(newVideo);
        
        // Remove from upload queue
        const meta = action.meta.arg;
        const fileId = meta.file.name + meta.file.size;
        state.uploadQueue = state.uploadQueue.filter(item => item.id !== fileId);
        delete state.uploadProgress[fileId];
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Videos
      .addCase(fetchVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        const { videos, pagination } = action.payload;
        
        if (pagination.page === 1) {
          state.videos = videos;
        } else {
          // Append for pagination
          state.videos = [...state.videos, ...videos];
        }
        
        state.pagination = pagination;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Video by ID
      .addCase(fetchVideoById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload.video;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Process Video
      .addCase(processVideo.pending, (state, action) => {
        const videoId = action.meta.arg.videoId;
        state.processingStatus[videoId] = { status: 'processing', progress: 0 };
      })
      .addCase(processVideo.fulfilled, (state, action) => {
        const { video } = action.payload;
        const videoId = video._id;
        
        // Update processing status
        state.processingStatus[videoId] = { 
          status: video.status, 
          progress: video.processingProgress 
        };
        
        // Update video in list
        const index = state.videos.findIndex(v => v._id === videoId);
        if (index !== -1) {
          state.videos[index] = { ...state.videos[index], ...video };
        }
        
        // Update current video
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo = { ...state.currentVideo, ...video };
        }
      })
      .addCase(processVideo.rejected, (state, action) => {
        const videoId = action.meta.arg.videoId;
        state.processingStatus[videoId] = { status: 'failed', progress: 0 };
        state.error = action.payload;
      })

      // Generate Clips
      .addCase(generateClips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateClips.fulfilled, (state, action) => {
        state.isLoading = false;
        const { video } = action.payload;
        
        if (state.currentVideo && state.currentVideo._id === video._id) {
          state.currentVideo.generatedClips = video.generatedClips;
        }
        
        // Update video in list
        const index = state.videos.findIndex(v => v._id === video._id);
        if (index !== -1) {
          state.videos[index].generatedClips = video.generatedClips;
        }
      })
      .addCase(generateClips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Video
      .addCase(deleteVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        const videoId = action.payload;
        
        // Remove from videos list
        state.videos = state.videos.filter(v => v._id !== videoId);
        
        // Remove from selected videos
        state.selectedVideos = state.selectedVideos.filter(id => id !== videoId);
        
        // Clear current video if it was deleted
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo = null;
        }
        
        // Clean up processing status
        delete state.processingStatus[videoId];
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Video Metadata
      .addCase(updateVideoMetadata.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVideoMetadata.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedVideo = action.payload.video;
        
        // Update video in list
        const index = state.videos.findIndex(v => v._id === updatedVideo._id);
        if (index !== -1) {
          state.videos[index] = { ...state.videos[index], ...updatedVideo };
        }
        
        // Update current video
        if (state.currentVideo && state.currentVideo._id === updatedVideo._id) {
          state.currentVideo = { ...state.currentVideo, ...updatedVideo };
        }
      })
      .addCase(updateVideoMetadata.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Import from URL
      .addCase(importFromUrl.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(importFromUrl.fulfilled, (state, action) => {
        state.isLoading = false;
        const newVideo = action.payload.video;
        state.videos.unshift(newVideo);
      })
      .addCase(importFromUrl.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  // Upload management
  addToUploadQueue,
  removeFromUploadQueue,
  updateUploadProgress,
  setUploadError,
  clearUploadQueue,

  // Processing status
  updateProcessingStatus,

  // Video selection
  selectVideo,
  selectAllVideos,
  clearSelection,

  // Filters and pagination
  setFilters,
  setPagination,
  resetFilters,

  // Current video
  setCurrentVideo,
  clearCurrentVideo,
  updateCurrentVideoClips,

  // Error handling
  clearError,

  // Real-time updates
  updateVideoInList,
  addVideoToList,
  removeVideoFromList,
} = videoSlice.actions;

// Selectors
export const selectVideos = (state) => state.video.videos;
export const selectCurrentVideo = (state) => state.video.currentVideo;
export const selectUploadQueue = (state) => state.video.uploadQueue;
export const selectUploadProgress = (state) => state.video.uploadProgress;
export const selectProcessingStatus = (state) => state.video.processingStatus;
export const selectSelectedVideos = (state) => state.video.selectedVideos;
export const selectFilters = (state) => state.video.filters;
export const selectPagination = (state) => state.video.pagination;
export const selectVideoLoading = (state) => state.video.isLoading;
export const selectVideoError = (state) => state.video.error;

export default videoSlice.reducer;
