import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select'; // Import React-Select
import api from '../../../services/api';
import CustomSnackbar from '../../../components/CustomSnackbar';

const CourseRegistrationPopup = ({ open, onClose, onSave, course, users }) => {
    const [name, setName] = useState(course?.name || '');
    const [acronym, setAcronym] = useState(course?.acronym || '');
    const [type, setType] = useState(course?.type || 'G');
    const [coordinatorId, setCoordinatorId] = useState(course?.coordinatorId || '');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (course) {
            setName(course.name || '');
            setAcronym(course.acronym || '');
            setType(course.type || 'G');
            setCoordinatorId(course.coordinatorId || '');
        } else {
            setName('');
            setAcronym('');
            setType('G');
            setCoordinatorId('');
        }
    }, [course, open]);

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Nome é obrigatório';
        if (!acronym) newErrors.acronym = 'Sigla é obrigatória';
        if (!coordinatorId) newErrors.coordinator = 'Coordenador é obrigatório';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            const courseData = { name, acronym, type, coordinatorId };
            if (course) {
                await api.put(`/courses/${course.id}`, courseData);
                setSnackbarMessage('Curso atualizado com sucesso!');
                setSnackbarType('success');
            } else {
                await api.post('/courses', courseData);
                setSnackbarMessage('Curso cadastrado com sucesso!');
                setSnackbarType('success');
            }
            onSave();
            onClose();
        } catch (error) {
            let errorMessage = error.response?.data?.error || "Erro ao cadastrar curso.";
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    const coordinatorOptions = users?.map((user) => ({
        value: user.id,
        label: user.username || 'Coordenador Não Definido',
    }));

    return (
        <>
            <Modal show={open} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{course ? 'Editar Curso' : 'Cadastrar Curso'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                value={acronym}
                                onChange={(e) => setAcronym(e.target.value)}
                                isInvalid={!!errors.acronym}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.acronym}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formType">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="G">Graduação</option>
                                <option value="T">Técnico</option>
                                <option value="I">Integrado</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formCoordinator">
                            <Form.Label>Coordenador</Form.Label>
                            <Select
                                options={coordinatorOptions}
                                value={coordinatorOptions.find(option => option.value === coordinatorId)}
                                onChange={(selectedOption) => setCoordinatorId(selectedOption.value)}
                                placeholder="Selecione o coordenador..."
                                isClearable
                            />
                            {errors.coordinator && (
                                <div className="invalid-feedback d-block">
                                    {errors.coordinator}
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
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

export default CourseRegistrationPopup;
