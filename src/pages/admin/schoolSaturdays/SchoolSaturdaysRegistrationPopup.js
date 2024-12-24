import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import api from '../../../services/api';
import CustomSnackbar from '../../../components/CustomSnackbar';

const SchoolSaturdaysRegistrationPopup = ({ open, onClose, onSave, schoolSaturday, semesters }) => {
    const [date, setDate] = useState(schoolSaturday?.date || '');
    const [weekday, setWeekday] = useState(schoolSaturday?.weekday || '');
    const [semesterId, setSemesterId] = useState(schoolSaturday?.semesterId || '');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (schoolSaturday) {
            setDate(schoolSaturday.date || '');
            setWeekday(schoolSaturday.weekday || '');
            setSemesterId(schoolSaturday.semesterId || '');
        } else {
            setDate('');
            setWeekday('');
            setSemesterId('');
        }
    }, [schoolSaturday, open]);

    const validate = () => {
        const newErrors = {};
        if (!date) newErrors.date = 'Data é obrigatória';
        if (!weekday) newErrors.weekday = 'Dia da semana é obrigatório';
        if (!semesterId) newErrors.semesterId = 'Semestre é obrigatório';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const selectedDate = new Date(date);
        if (selectedDate.getDay() !== 5) {
            setSnackbarMessage('A data precisa ser um sábado.');
            setSnackbarType('error');
            return;
        }

        try {
            const schoolSaturdayData = { date, weekday, semesterId };
            if (schoolSaturday) {
                await api.put(`/school-saturdays/${schoolSaturday.id}`, schoolSaturdayData);
                setSnackbarMessage('Sábado letivo atualizado com sucesso!');
                setSnackbarType('success');
            } else {
                await api.post('/school-saturdays', schoolSaturdayData);
                setSnackbarMessage('Sábado letivo cadastrado com sucesso!');
                setSnackbarType('success');
            }
            onSave();
            onClose();
        } catch (error) {
            let errorMessage = error.response?.data?.error || 'Erro ao salvar sábado letivo';
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    const semesterOptions = semesters?.map((semester) => ({
        value: semester.id,
        label: `${semester.year}.${semester.semester} (${semester.type === 'regular' ? 'Regular' : 'Convencional'})` || 'Semestre Não Definido',
    }));

    return (
        <Modal show={open} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{schoolSaturday ? 'Editar' : 'Cadastrar'} Sábado Letivo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="date">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            isInvalid={!!errors.date}
                        />
                        <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="weekday">
                        <Form.Label>Dia da Semana</Form.Label>
                        <Select
                            value={weekday ? { value: weekday, label: weekday } : null}
                            onChange={(selectedOption) => setWeekday(selectedOption?.value || '')}
                            options={[
                                { value: 'segunda', label: 'Segunda' },
                                { value: 'terca', label: 'Terça' },
                                { value: 'quarta', label: 'Quarta' },
                                { value: 'quinta', label: 'Quinta' },
                                { value: 'sexta', label: 'Sexta' },
                            ]}
                            isInvalid={!!errors.weekday}
                            placeholder="Selecione um dia da semana..."
                        />
                        {errors.weekday && (
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {errors.weekday}
                            </div>
                        )}
                    </Form.Group>
                    <Form.Group controlId="semesterId">
                        <Form.Label>Semestre</Form.Label>
                        <Select
                            value={semesterOptions.find(option => option.value === semesterId)}
                            onChange={(selectedOption) => setSemesterId(selectedOption?.value || '')}
                            options={semesterOptions}
                            isInvalid={!!errors.semesterId}
                            placeholder="Selecione um semestre..."
                        />
                        {errors.semesterId && (
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {errors.semesterId}
                            </div>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSave}>Salvar</Button>
            </Modal.Footer>
            <CustomSnackbar
                type={snackbarType}
                message={snackbarMessage}
                duration={6000}
                onClose={() => setSnackbarMessage('')}
            />
        </Modal>
    );
};

export default SchoolSaturdaysRegistrationPopup;
