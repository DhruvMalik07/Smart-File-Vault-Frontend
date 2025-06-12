import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [fileChangeTrigger, setFileChangeTrigger] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFileChange = () => {
    setFileChangeTrigger(prev => prev + 1);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart File Vault
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Files
        </Typography>
        <Box sx={{ my: 4 }}>
          <FileUpload onUploadSuccess={handleFileChange} />
        </Box>
        <Box>
          <FileList refreshTrigger={fileChangeTrigger} onFileChange={handleFileChange} />
        </Box>
      </Container>
    </>
  );
};

export default DashboardPage; 