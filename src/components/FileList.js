import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { Download, Share, Delete } from '@mui/icons-material';
import api from '../services/api';

const FileList = ({ refreshTrigger, onFileChange }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (err) {
      setError('Could not fetch files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob', // Important for file downloads
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file.');
    }
  };

  const handleShare = async (fileId) => {
    try {
      const response = await api.post(`/files/share/${fileId}`);
      setShareLink(response.data.shareUrl);
      setOpenShareModal(true);
    } catch (err) {
      console.error('Share error:', err);
      setError('Failed to generate share link.');
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      await api.delete(`/files/${fileToDelete._id}`);
      closeDeleteConfirm();
      if (onFileChange) {
        onFileChange();
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete file.');
      closeDeleteConfirm();
    }
  };

  const openDeleteConfirm = (file) => {
    setFileToDelete(file);
  };

  const closeDeleteConfirm = () => {
    setFileToDelete(null);
  };

  const handleCloseShareModal = () => {
    setOpenShareModal(false);
    setShareLink('');
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6">Your Uploaded Files</Typography>
      {files.length === 0 ? (
        <Typography>You have not uploaded any files yet.</Typography>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem
              key={file._id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="download" onClick={() => handleDownload(file._id, file.originalName)}>
                    <Download />
                  </IconButton>
                  <IconButton edge="end" aria-label="share" onClick={() => handleShare(file._id)}>
                    <Share />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => openDeleteConfirm(file)}>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={file.originalName}
                secondary={`Size: ${Math.round(file.size / 1024)} KB - Uploaded: ${new Date(file.uploadDate).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
      {/* Share Link Modal */}
      <Dialog open={openShareModal} onClose={handleCloseShareModal}>
        <DialogTitle>Share File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Here is the shareable link. It will expire in 24 hours.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Shareable Link"
            type="text"
            fullWidth
            variant="standard"
            value={shareLink}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShareModal}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!fileToDelete}
        onClose={closeDeleteConfirm}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the file "{fileToDelete?.originalName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileList; 