import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { setLanguage } from '../../store/slices/uiSlice';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { language } = useSelector(state => state.ui);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenu = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    handleLangClose();
  };

  const languages = [
    { code: 'pt-BR', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🎬 ViralCut Pro
          </Typography>

          {/* Language Selector */}
          <IconButton
            size="large"
            color="inherit"
            onClick={handleLangMenu}
          >
            <Language />
          </IconButton>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLangClose}
          >
            {languages.map((lang) => (
              <MenuItem 
                key={lang.code} 
                onClick={() => handleLanguageChange(lang.code)}
                selected={language === lang.code}
              >
                {lang.name}
              </MenuItem>
            ))}
          </Menu>

          {isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  {t('profile')}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  {t('myAccount')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  {t('logout')}
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit">
              {t('login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2024 ViralCut Pro. {t('allRightsReserved')}
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
