import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ type, duration, message, onClose }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (message) {
            setOpen(true);
        }
    }, [message]);

    const handleClose = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position in the top-right corner
        >
            <Alert
                onClose={handleClose}
                severity={type} // Type of message (success, error, etc.)
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
