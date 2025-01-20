import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../../services/api';
import CustomSnackbar from '../../../components/CustomSnackbar';

const SemesterRegistrationPopup = ({ open, onClose, onSave, semester }) => {
    const [formData, setFormData] = useState({
        year: '',
        semester: 1,
        type: 'convencional',
        status: true,
        start_date: '',
        end_date: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');

    useEffect(() => {
        if (semester) {

            setFormData({
                year: semester.year,
                semester: semester.semester,
                type: semester.type,
                status: semester.status,
                start_date: semester.start_date,
                end_date: semester.end_date,
            });
        } else {
            setFormData({
                year: '',
                semester: 1,
                type: 'convencional',
                status: true,
                start_date: '',
                end_date: '',
            });
        }
    }, [semester, open]);

    const validate = () => {
        const newErrors = {};
        if (!formData.year) newErrors.year = 'Ano é obrigatório';
        if (!formData.start_date) newErrors.start_date = 'Data de início é obrigatória';
        if (!formData.end_date) newErrors.end_date = 'Data de término é obrigatória';
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
                ...formData,
            };

            if (semester) {
                const response = await api.put(`/semesters/${semester.id}`, payload);
                if (response.status === 200) {
                    setSnackbarMessage('Semestre atualizado com sucesso!');
                    setSnackbarType('success');
                    onSave(response.data);
                    onClose();
                }
            } else {
                const response = await api.post('/semesters', payload);
                if (response.status === 201) {
                    setSnackbarMessage('Semestre cadastrado com sucesso!');
                    setSnackbarType('success');
                    onSave(formData);
                    onClose();
                }
            }

            setFormData({
                year: '',
                semester: 1,
                type: 'convencional',
                status: true,
                start_date: '',
                end_date: '',
            });
            setErrors({});
        } catch (error) {
            let errorMessage = error.response?.data?.error || "Erro ao cadastrar semestre.";
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    return (
        <>
            <Modal show={open} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{semester ? 'Editar Semestre' : 'Cadastrar Novo Semestre'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formYear">
                            <Form.Label>Ano</Form.Label>
                            <Form.Control
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                isInvalid={!!errors.year}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.year}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formSemester">
                            <Form.Label>Semestre</Form.Label>
                            <Form.Control
                                as="select"
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                            >
                                <option value={1}>1º Semestre</option>
                                <option value={2}>2º Semestre</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formType">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="convencional">Convencional</option>
                                <option value="regular">Regular</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Check
                                type="checkbox"
                                label="Ativo"
                                name="status"
                                checked={formData.status}
                                onChange={() => setFormData({ ...formData, status: !formData.status })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Data de Início</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                isInvalid={!!errors.start_date}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.start_date}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>Data de Término</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                isInvalid={!!errors.end_date}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.end_date}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
            <CustomSnackbar
                type={snackbarType}
                message={snackbarMessage}
                duration={5000}
                onClose={() => setSnackbarMessage('')}
            />
        </>
    );
};

export default SemesterRegistrationPopup;
