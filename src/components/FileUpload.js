import React, { useState } from 'react';
import { Button, TextField, Box, Typography, LinearProgress, Alert } from '@mui/material';
import api from '../services/api';

const FileUpload = ({ onFileChange }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      setSuccess('File uploaded successfully!');
      if (onFileChange) {
        onFileChange();
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 4 }}>
      <Typography variant="h6">Upload a New File</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <TextField
        type="file"
        fullWidth
        margin="normal"
        onChange={handleFileChange}
      />
      {uploading && (
        <Box sx={{ width: '100%', mr: 1, mt: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={uploading}
        sx={{ mt: 2 }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </Box>
  );
};

export default FileUpload; 