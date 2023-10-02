import { useContext, useState } from 'react';
import jwt_decode from 'jwt-decode';
import AuthContext from '../Context/userAuthContext';
import { Link, useNavigate } from 'react-router-dom';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home'; // Import HomeIcon
import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Settings from '@mui/icons-material/Settings';

export const NavigationBar = () => {
  const Navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem('authTokens');
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutUser = () => {
    setAnchorEl(null);
    logoutUser()
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    Navigate("/profile")
  };

  const handleSettingsClick = () => {
    setAnchorEl(null);
    Navigate("/settings")
  };

  if (token) {
    const decoded = jwt_decode(token);
    var user_id = decoded.user_id;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="a" href="/" sx={{
            flexGrow: 1, 
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}>
            Digital Library
          </Typography>
          {token === null ? (
            <>
              {/* Make the HomeIcon clickable and navigate to the root URL */}
              {/* <HomeIcon color="inherit" style={{ marginRight: '16px' }} /> */}
              {/* <Button color="inherit" component={Link} to="/">
                Home
              </Button> */}
              {/* <Button color="inherit" component={Link} to="/">
                Search
              </Button> */}
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleClick}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSettingsClick}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogoutUser}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
            // <>
            //   <HomeIcon color="inherit" style={{ marginRight: '16px' }} />
            //   <Button color="inherit" component={Link} to="/dashboard">
            //     Dashboard
            //   </Button>
            //   <Button
            //     color="inherit"
            //     onClick={logoutUser}
            //     style={{ cursor: 'pointer' }}
            //   >
            //     Logout
            //   </Button>
            // </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
