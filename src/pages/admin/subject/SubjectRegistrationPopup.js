import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../services/api';
import CustomSnackbar from '../../../components/CustomSnackbar';

const SubjectRegistrationPopup = ({ open, onClose, onSave, subject }) => {
    const [formData, setFormData] = useState({
        name: '',
        acronym: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');

    useEffect(() => {
        if (subject) {
            setFormData({
                name: subject.name,
                acronym: subject.acronym,
            });
        } else {
            setFormData({
                name: '',
                acronym: '',
            });
        }
    }, [subject, open]);

    const validate = () => {
        const newErrors = {};
        // Add validation logic if needed
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
                acronym: formData.acronym,
            };

            if (subject) {
                const response = await api.put(`/subjects/${subject.id}`, payload);
                if (response.status === 200) {
                    setSnackbarMessage('Matéria atualizada com sucesso!');
                    setSnackbarType('success');
                    onSave(response.data);
                    onClose();
                }
            } else {
                const response = await api.post('/subjects', payload);
                if (response.status === 201) {
                    setSnackbarMessage('Matéria cadastrada com sucesso!');
                    setSnackbarType('success');
                    onSave(formData);
                    onClose();
                }
            }

            setFormData({
                name: '',
                acronym: '',
            });
            setErrors({});
        } catch (error) {
            let errorMessage = error.response?.data?.error || "Erro ao cadastrar disciplina.";
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    return (
        <>
            <Modal show={open} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{subject ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Descrição</Form.Label>
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
                        <Form.Group controlId="formAcronym">
                            <Form.Label>Sigla</Form.Label>
                            <Form.Control
                                type="text"
                                name="acronym"
                                value={formData.acronym}
                                onChange={handleChange}
                                isInvalid={!!errors.acronym}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.acronym}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {subject ? 'Salvar Alterações' : 'Cadastrar'}
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

export default SubjectRegistrationPopup;
