import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false,
  language: 'pt-BR',
  sidebarOpen: true,
  notifications: [],
  loading: {
    global: false,
    upload: false,
    processing: false,
  },
  modals: {
    videoUpload: false,
    settings: false,
    profile: false,
    payment: false,
    twoFactor: false,
  },
  alerts: [],
  theme: 'default',
  layout: 'default',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme and appearance
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    // Loading states
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setUploadLoading: (state, action) => {
      state.loading.upload = action.payload;
    },
    setProcessingLoading: (state, action) => {
      state.loading.processing = action.payload;
    },
    setLoading: (state, action) => {
      const { type, value } = action.payload;
      if (state.loading.hasOwnProperty(type)) {
        state.loading[type] = value;
      }
    },

    // Modals
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    toggleModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = !state.modals[modalName];
      }
    },

    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(
        notification => notification.id !== notificationId
      );
    },
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Alerts (for temporary messages)
    addAlert: (state, action) => {
      const alert = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        autoHide: true,
        duration: 5000,
        ...action.payload,
      };
      state.alerts.push(alert);
    },
    removeAlert: (state, action) => {
      const alertId = action.payload;
      state.alerts = state.alerts.filter(alert => alert.id !== alertId);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },

    // Layout
    setLayout: (state, action) => {
      state.layout = action.payload;
    },

    // Reset UI state
    resetUI: (state) => {
      return {
        ...initialState,
        darkMode: state.darkMode, // Preserve theme preference
        language: state.language, // Preserve language preference
      };
    },
  },
});

export const {
  // Theme and appearance
  toggleDarkMode,
  setDarkMode,
  setLanguage,
  setTheme,

  // Sidebar
  toggleSidebar,
  setSidebarOpen,

  // Loading states
  setGlobalLoading,
  setUploadLoading,
  setProcessingLoading,
  setLoading,

  // Modals
  openModal,
  closeModal,
  closeAllModals,
  toggleModal,

  // Notifications
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,

  // Alerts
  addAlert,
  removeAlert,
  clearAlerts,

  // Layout
  setLayout,

  // Reset
  resetUI,
} = uiSlice.actions;

// Selectors
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectLanguage = (state) => state.ui.language;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectLoading = (state) => state.ui.loading;
export const selectModals = (state) => state.ui.modals;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read);
export const selectAlerts = (state) => state.ui.alerts;
export const selectTheme = (state) => state.ui.theme;
export const selectLayout = (state) => state.ui.layout;

export default uiSlice.reducer;
