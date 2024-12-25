import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ClassTimetable = () => {
    const timetable = {
        Monday: { morning: ['', '', '', ''], afternoon: ['', '', '', ''], night: ['', '', '', ''] },
        Tuesday: { morning: ['', '', '', ''], afternoon: ['', '', '', ''], night: ['', '', '', ''] },
        Wednesday: { morning: ['', '', '', ''], afternoon: ['', '', '', ''], night: ['', '', '', ''] },
        Thursday: { morning: ['', '', '', ''], afternoon: ['', '', '', ''], night: ['', '', '', ''] },
        Friday: { morning: ['', '', '', ''], afternoon: ['', '', '', ''], night: ['', '', '', ''] },
    };

    const daysOfWeek = { Monday: 'Segunda', Tuesday: 'Terça', Wednesday: 'Quarta', Thursday: 'Quinta', Friday: 'Sexta' };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [updatedTimetable, setUpdatedTimetable] = useState(timetable);

    const disciplines = ['Math', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'PE', 'Art', 'Music', 'Computer Science', 'Philosophy'];
    const teachers = ['Teacher 1', 'Teacher 2', 'Teacher 3', 'Teacher 4'];

    const handleButtonClick = (day, shift, timeSlot) => {
        setSelectedTimeSlot({ day, shift, timeSlot });
        setModalVisible(true);
    };

    const handleSaveSelection = () => {
        if (selectedTimeSlot) {
            const { day, shift, timeSlot } = selectedTimeSlot;
            const updatedDayTimetable = { ...updatedTimetable[day], [shift]: updatedTimetable[day][shift].map((className, index) => (index === timeSlot ? `${selectedDiscipline} - ${selectedTeacher}` : className)) };
            const updatedWeekTimetable = { ...updatedTimetable, [day]: updatedDayTimetable };
            setUpdatedTimetable(updatedWeekTimetable);
            setModalVisible(false); // Close modal after saving
        }
    };

    const createShiftTable = (shiftName) => {
        return (
            <div className="timetable-table">
                <h3>{shiftName}</h3>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Horário</th>
                        {Object.keys(timetable).map((day) => (
                            <th key={day}>{daysOfWeek[day]}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {['A', 'B', 'C', 'D'].map((timeSlot, index) => (
                        <tr key={timeSlot}>
                            <td>{timeSlot}</td>
                            {Object.keys(timetable).map((day) => {
                                const className = updatedTimetable[day][shiftName]?.[index];
                                return (
                                    <td key={`${day}-${timeSlot}`}>
                                        {className ? className : ''}
                                        <button onClick={() => handleButtonClick(day, shiftName, index)} className="btn btn-primary">Add Discipline</button>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container">
            <h2>Horário da Turma </h2>
            {createShiftTable('Manhã')}
            {createShiftTable('Tarde')}
            {createShiftTable('Noite')}

            {/* Bootstrap Modal */}
            <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Discipline and Teacher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDiscipline">
                            <Form.Label>Discipline</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedDiscipline}
                                onChange={(e) => setSelectedDiscipline(e.target.value)}
                            >
                                <option value="">Select Discipline</option>
                                {disciplines.map((discipline) => (
                                    <option key={discipline} value={discipline}>
                                        {discipline}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formTeacher">
                            <Form.Label>Teacher</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher} value={teacher}>
                                        {teacher}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalVisible(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveSelection}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ClassTimetable;
