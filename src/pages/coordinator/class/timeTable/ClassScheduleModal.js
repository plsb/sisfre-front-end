import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from "react-select";
import CustomSnackbar from '../../../../components/CustomSnackbar';  // Import CustomSnackbar component

const ClassScheduleModal = ({
                                modalVisible,
                                setModalVisible,
                                selectedTimeSlot,
                                formatTimeSlot,
                                disciplines,
                                teachers,
                                selectedDiscipline,
                                setSelectedDiscipline,
                                selectedTeacher,
                                setSelectedTeacher,
                                handleSaveSelection
                            }) => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });

    const handleSaveWithErrorHandling = async () => {
        try {
            await handleSaveSelection();  // Call the original save handler
        } catch (error) {
            setSnackbar({ open: true, message: 'Erro ao salvar o horário. Tente novamente.', type: 'error' });
        }
    };

    return (
        <>
            <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecione a Disciplina e o Professor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Horário Selecionado: </strong>
                        {formatTimeSlot()}
                    </p>
                    <Form>
                        <Form.Group controlId="formDiscipline">
                            <Form.Label>Disciplina</Form.Label>
                            <Select
                                options={disciplines}
                                value={selectedDiscipline}
                                onChange={(option) => setSelectedDiscipline(option)}
                                placeholder="Selecione a disciplina"
                                isClearable
                            />
                        </Form.Group>

                        <Form.Group controlId="formTeacher">
                            <Form.Label>Professor</Form.Label>
                            <Select
                                options={teachers}
                                value={selectedTeacher}
                                onChange={(option) => setSelectedTeacher(option)}
                                placeholder="Selecione o professor"
                                isClearable
                                isLoading={teachers.length === 0} // Indica carregamento enquanto não há opções.
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() =>
                    {
                        setModalVisible(false);
                        setSelectedDiscipline(null);
                        setSelectedTeacher(null);
                    }
                        }>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveWithErrorHandling}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Snackbar for error/success messages */}
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar({ open: false, message: '', type: '' })}
                duration={5000}  // You can change the duration here
            />
        </>
    );
};

export default ClassScheduleModal;
