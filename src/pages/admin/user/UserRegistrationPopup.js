import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import api from '../../../services/api';  // Import the api instance
import CustomSnackbar from '../../../components/CustomSnackbar';  // Import the CustomSnackbar component

const UserRegistrationPopup = ({ open, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'

    useEffect(() => {
        if (user) {
            // Fetch user data when userId is provided for editing
            setFormData({
                name: user.username,
                email: user.email,
                password: '',  // Don't pre-fill password fields
                confirmPassword: '',  // Don't pre-fill password fields
            });

        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [user, open]);

    const validate = () => {
        const newErrors = {};

        // Name validation (at least two words)
        if (!/^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+)+$/.test(formData.name.trim())) {
            newErrors.name = 'Insira pelo menos o nome e o sobrenome.';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Insira um email válido.';
        }

        // Password validation (only for new user or when password is changed)
        if (formData.password.length < 6 && formData.password) {
            newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear the specific field error
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        try {
            if (user) {
                // Update user
                const response = await api.put(`/users/${user.id}`, {
                    email: formData.email,
                    password: formData.password || undefined,  // Only update password if it's filled
                    username: formData.name,
                });

                if (response.status === 200) {
                    setSnackbarMessage('Usuário atualizado com sucesso!');
                    setSnackbarType('success');
                    onSave(response.data);  // Pass updated data to parent
                    onClose();  // Close the popup
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    });
                    setErrors({});
                }
            } else {
                // Create new user
                const response = await api.post('/users', {
                    email: formData.email,
                    password: formData.password,
                    username: formData.name,  // Send the name as the username
                });

                if (response.status === 201) {
                    setSnackbarMessage('Usuário cadastrado com sucesso!');
                    setSnackbarType('success');
                    onSave(formData);  // Pass form data to parent (if needed)
                    onClose();  // Close the popup
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    });
                    setErrors({});
                }
            }
        } catch (error) {
            let errorMessage = 'Erro ao salvar usuário!';

            // Check if error is a response with status 400 and display the message from the server
            if (error.response && error.response.status === 400) {
                errorMessage = error.response.data.error || 'Erro de validação. Verifique os dados fornecidos.';
            }

            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
            console.error('Error saving user:', error);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>{user ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Senha"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Confirmação de Senha"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar component */}
            <CustomSnackbar
                type={snackbarType}
                duration={6000}
                message={snackbarMessage}
                onClose={() => setSnackbarMessage('')}
            />
        </>
    );
};

export default UserRegistrationPopup;
