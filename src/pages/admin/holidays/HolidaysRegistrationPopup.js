import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../services/api';
import CustomSnackbar from '../../../components/CustomSnackbar';

const HolidaysRegistrationPopup = ({ open, onClose, onSave, holiday }) => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');

    useEffect(() => {
        if (holiday) {
            setFormData({
                name: holiday.name,
                date: holiday.date,
            });
        } else {
            setFormData({
                name: '',
                date: '',
            });
        }
    }, [holiday, open]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'O nome do feriado é obrigatório';
        if (!formData.date) newErrors.date = 'A data do feriado é obrigatória';
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
                name: formData.name,
                date: formData.date,
            };

            if (holiday) {
                const response = await api.put(`/holidays/${holiday.id}`, payload);
                if (response.status === 200) {
                    setSnackbarMessage('Feriado atualizado com sucesso!');
                    setSnackbarType('success');
                    onSave(response.data);
                    onClose();
                }
            } else {
                const response = await api.post('/holidays', payload);
                if (response.status === 201) {
                    setSnackbarMessage('Feriado cadastrado com sucesso!');
                    setSnackbarType('success');
                    onSave(response.data);
                    onClose();
                }
            }

            setFormData({
                name: '',
                date: '',
            });
            setErrors({});
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao cadastrar feriado.';
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    return (
        <>
            <Modal show={open} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{holiday ? 'Editar Feriado' : 'Cadastrar Novo Feriado'}</Modal.Title>
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
                        <Form.Group controlId="formDate">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                isInvalid={!!errors.date}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.date}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {holiday ? 'Salvar Alterações' : 'Cadastrar'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <CustomSnackbar
                type={snackbarType}
                message={snackbarMessage}
                duration={6000}
                onClose={() => setSnackbarMessage('')}
            />
        </>
    );
};

export default HolidaysRegistrationPopup;
