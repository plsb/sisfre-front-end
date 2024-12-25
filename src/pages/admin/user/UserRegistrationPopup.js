import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../services/api';
import CustomSnackbar from '../../../components/CustomSnackbar';

const UserRegistrationPopup = ({ open, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        accessType: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.username,
                email: user.email,
                password: '',
                confirmPassword: '',
                accessType: user.accessType || '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                accessType: '',
            });
        }
    }, [user, open]);

    const validate = () => {
        const newErrors = {};
        // validation logic...
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        try {
            const payload = {
                email: formData.email,
                username: formData.name,
                accessType: formData.accessType,
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            if (user) {
                const response = await api.put(`/users/${user.id}`, payload);
                if (response.status === 200) {
                    setSnackbarMessage('Usuário atualizado com sucesso!');
                    setSnackbarType('success');
                    onSave(response.data);
                    onClose();
                }
            } else {
                const response = await api.post('/users', payload);
                if (response.status === 201) {
                    setSnackbarMessage('Usuário cadastrado com sucesso!');
                    setSnackbarType('success');
                    onSave(formData);
                    onClose();
                }
            }

            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                accessType: '',
            });
            setErrors({});
        } catch (error) {
            let errorMessage = error.response?.data?.error || "Erro ao cadastrar usuário.";
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    return (
        <>
            <Modal show={open} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{user ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>Confirmação de Senha</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formAccessType">
                            <Form.Label>Tipo de Acesso</Form.Label>
                            <Form.Control
                                as="select"
                                name="accessType"
                                value={formData.accessType}
                                onChange={handleChange}
                                isInvalid={!!errors.accessType}
                            >
                                <option value="professor">Professor</option>
                                <option value="staff">Funcionário</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.accessType}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
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
