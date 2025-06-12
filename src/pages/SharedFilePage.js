import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../services/api';

const SharedFilePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const downloadFile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/files/download/shared/${token}`, {
          responseType: 'blob',
        });

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers['content-disposition'];
        const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

        setFileName(filename);

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setLoading(false);
      } catch (err) {
        console.error('Download error:', err);
        setError(err.response?.data?.msg || 'Error downloading file');
        setLoading(false);
      }
    };

    downloadFile();
  }, [token]);

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Downloading file...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          File Downloaded Successfully!
        </Typography>
        <Typography variant="body1" gutterBottom>
          {fileName}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default SharedFilePage; 