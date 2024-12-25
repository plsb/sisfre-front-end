import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select'; // Import React-Select
import api from '../../../services/api';
import CustomSnackbar from '../../../components/CustomSnackbar';

const ClassRegistrationPopup = ({ open, onClose, onSave, classItem, courses, semesters }) => {
    const [description, setDescription] = useState(classItem?.description || '');
    const [courseId, setCourseId] = useState(classItem?.courseId || '');
    const [semesterId, setSemesterId] = useState(classItem?.semesterId || '');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (classItem) {
            setDescription(classItem.description || '');
            setCourseId(classItem.courseId || '');
            setSemesterId(classItem.semesterId || '');
        } else {
            setDescription('');
            setCourseId('');
            setSemesterId('');
        }
    }, [classItem, open]);

    const validate = () => {
        const newErrors = {};
        if (!description) newErrors.description = 'Descrição é obrigatória';
        if (!courseId) newErrors.course = 'Curso é obrigatório';
        if (!semesterId) newErrors.semester = 'Semestre é obrigatório';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            const classData = { description, courseId, semesterId };
            if (classItem) {
                await api.put(`/classes/${classItem.id}`, classData);
                setSnackbarMessage('Classe atualizada com sucesso!');
                setSnackbarType('success');
            } else {
                await api.post('/classes', classData);
                setSnackbarMessage('Classe cadastrada com sucesso!');
                setSnackbarType('success');
            }
            onSave();
            onClose();
        } catch (error) {
            let errorMessage = error.response?.data?.error || "Erro ao cadastrar classe.";
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    const courseOptions = courses?.map((course) => ({
        value: course.id,
        label: course.name,
    }));

    const semesterOptions = semesters?.map((semester) => ({
        value: semester.id,
        label: `${semester.year}.${semester.semester} (${semester.type === 'regular' ? 'Regular' : 'Convencional'})` || 'Semestre Não Definido',
    }));

    return (
        <>
            <Modal show={open} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{classItem ? 'Editar Classe' : 'Cadastrar Nova Classe'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Curso</Form.Label>
                            <Select
                                options={courseOptions}
                                value={courseOptions.find((option) => option.value === courseId)}
                                onChange={(selectedOption) => setCourseId(selectedOption?.value || '')}
                                isInvalid={!!errors.course}
                                placeholder={'Selecione o curso...'}
                            />
                            {errors.course && <div className="invalid-feedback d-block">{errors.course}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Semestre</Form.Label>
                            <Select
                                options={semesterOptions}
                                value={semesterOptions.find((option) => option.value === semesterId)}
                                onChange={(selectedOption) => setSemesterId(selectedOption?.value || '')}
                                isInvalid={!!errors.semester}
                                placeholder={'Selecione o semestre...'}
                            />
                            {errors.semester && <div className="invalid-feedback d-block">{errors.semester}</div>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Fechar</Button>
                    <Button variant="primary" onClick={handleSave}>Salvar</Button>
                </Modal.Footer>
            </Modal>
            {snackbarMessage && (
                <CustomSnackbar
                    type={snackbarType}
                    message={snackbarMessage}
                    duration={6000}
                    onClose={() => setSnackbarMessage('')}
                />
            )}
        </>
    );
};

export default ClassRegistrationPopup;
