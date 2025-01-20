// src/pages/Coordinator/ClassTimetable.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import api from "../../../../services/api";
import CustomSnackbar from "../../../../components/CustomSnackbar";
import CoordinatorMenu from "../../../../layouts/menus/CoordinatorMenu";
import Layout from "../../../../layouts/Layout";
import ClassScheduleModal from "./ClassScheduleModal"; // Import the new modal component
import './styles.css';

const ClassTimetable = () => {
    const { classId } = useParams();

    const [classInfo, setClassInfo] = useState(null);

    const timetable = {
        Monday: { morning: ['', ''], afternoon: ['', ''], night: ['', ''] },
        Tuesday: { morning: ['', ''], afternoon: ['', ''], night: ['', ''] },
        Wednesday: { morning: ['', ''], afternoon: ['', ''], night: ['', ''] },
        Thursday: { morning: ['', ''], afternoon: ['', ''], night: ['', ''] },
        Friday: { morning: ['', ''], afternoon: ['', ''], night: ['', ''] },
    };

    const daysOfWeek = {
        Monday: 'Segunda',
        Tuesday: 'Terça',
        Wednesday: 'Quarta',
        Thursday: 'Quinta',
        Friday: 'Sexta',
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [updatedTimetable, setUpdatedTimetable] = useState(timetable);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });

    const [teachers, setTeachers] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [hoursCount, setHoursCount] = useState({}); // Object to keep track of hours for each subject-professor pair

    const handleDeleteSchedule = async (day, shift, timeSlot) => {
        const formattedDay = daysOfWeek[day]
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[ç]/g, 'c');

        // Prepare data for the request
        const scheduleData = {
            classId,
            schedule: timeSlot === 0 ? 'AB' : 'CD',
            shift: shift.charAt(0).toUpperCase() === 'M' ? 'M' : shift.charAt(0).toUpperCase() === 'A' ? 'T' : 'N',
            dayWeek: formattedDay,
        };

        try {
            // Send a DELETE request to the backend
            await api.delete(`/class-schedules`, { data: scheduleData });

            // Update the timetable after successful deletion
            const updatedSchedule = { ...updatedTimetable };
            updatedSchedule[day][shift][timeSlot] = '';
            setUpdatedTimetable(updatedSchedule);

            // Show success notification
            setSnackbar({ open: true, message: 'Horário excluído com sucesso!', type: 'success' });
        } catch (error) {
            // Show error notification if deletion fails
            setSnackbar({ open: true, message: 'Erro ao excluir horário. Tente novamente.', type: 'error' });
        }
    };

    const fetchClassesSchedule = async () => {
        try {
            const response = await api.get(`/class-schedules/${classId}`);

            const schedules = response.data;
            // Create a new timetable to store the fetched data
            const updatedSchedule = { ...updatedTimetable };
            let updatedHoursCount = { };

            const dayMapping = {
                'segunda': 'Monday',
                'terca': 'Tuesday',
                'quarta': 'Wednesday',
                'quinta': 'Thursday',
                'sexta': 'Friday',
            };

            // Iterate through each schedule and update the timetable
            schedules.classSchedules.forEach((schedule) => {
                const { dayWeek, shift, schedule: timeSlot, professor, subject } = schedule;

                const englishDay = dayMapping[dayWeek.toLowerCase()];

                if (updatedSchedule[englishDay]) {
                    // Initialize the shift structure if it doesn't exist
                    if (!updatedSchedule[englishDay].morning) {
                        updatedSchedule[englishDay].morning = [];
                    }
                    if (!updatedSchedule[englishDay].afternoon) {
                        updatedSchedule[englishDay].afternoon = [];
                    }
                    if (!updatedSchedule[englishDay].night) {
                        updatedSchedule[englishDay].night = [];
                    }

                    const shiftIndex = shift === 'M' ? 'morning' : shift === 'T' ? 'afternoon' : 'night';
                    const timeSlotIndex = timeSlot === 'AB' ? 0 : 1;

                    // Assign the class name in the correct slot
                    updatedSchedule[englishDay][shiftIndex][timeSlotIndex] = `${subject.acronym} - ${professor.username}`;

                    // Track the hours for each subject-professor combination
                    const key = `${subject.acronym} - ${professor.username}`;
                    updatedHoursCount[key] = (updatedHoursCount[key] || 0) + 40; // Add 40 hours for each occurrence
                }
            });

            // Update the timetable state
            setUpdatedTimetable(updatedSchedule);
            setHoursCount(updatedHoursCount);
        } catch (err) {
            setSnackbar({ open: true, message: err.response.data.error, type: 'error' });
        }
    };

    const fetchProfessors = async () => {
        try {
            const mockProfessores = await api.get(`/coordinator/professors`);
            const professorOptions = mockProfessores?.data?.users?.map((user) => ({
                value: user.id,
                label: user.username,
            }));

            setTeachers(professorOptions);
        } catch (err) {
            setSnackbar({ open: true, message: 'Erro ao carregar professores. Tente novamente.', type: 'error' });
        }
    };

    const fetchSubjects = async () => {
        try {
            const mockSubjects = await api.get(`/coordinator/subjects`);
            const subjectsOptions = mockSubjects?.data?.subjects?.map((subject) => ({
                value: subject.id,
                label: subject.name,
            }));

            setDisciplines(subjectsOptions);
        } catch (err) {
            setSnackbar({ open: true, message: 'Erro ao carregar disciplinas. Tente novamente.', type: 'error' });
        }
    };

    const handleButtonClick = (day, shift, timeSlot) => {
        setSelectedTimeSlot({ day, shift, timeSlot });
        setModalVisible(true);
    };

    const handleSaveSelection = async () => {
        if (selectedTimeSlot && selectedDiscipline && selectedTeacher) {
            const { day, shift, timeSlot } = selectedTimeSlot;

            const formattedDay = daysOfWeek[day]
                .toLowerCase()
                .normalize("NFD") // Normaliza a string para decompor caracteres acentuados
                .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
                .replace(/[ç]/g, 'c'); // Substitui 'ç' por 'c'

            // Prepare the data to send to the API
            const scheduleData = {
                classId,
                subjectId: selectedDiscipline.value,
                shift: shift.charAt(0).toUpperCase() === 'M' ? 'M' : shift.charAt(0).toUpperCase() === 'A' ? 'T' : 'N',
                schedule: timeSlot === 0 ? 'AB' : 'CD', // Adjust according to your time slot mapping
                professorId: selectedTeacher.value,
                dayWeek: formattedDay, // Convert the day to lowercase for consistency with your API
            };

            try {
                // Make the API POST request to save the schedule
                await api.post('/class-schedules', scheduleData);

                // If the schedule is saved successfully, update the timetable on the frontend
                fetchClassesSchedule();

                // Close the modal and show success notification
                setModalVisible(false);
                setSnackbar({ open: true, message: 'Horário salvo com sucesso!', type: 'success' });

            } catch (error) {
                // If an error occurs, show an error notification
                let errorMessage = error.response?.data?.error || "Erro ao cadastrar horário.";
                setSnackbar({ open: true, message: errorMessage, type: 'error' });
            }
        } else {
            // If required fields are missing, show a validation message
            setSnackbar({ open: true, message: 'Preencha todos os campos corretamente!', type: 'warning' });
        }
        setSelectedDiscipline(null);
        setSelectedTeacher(null);
    };

    const formatTimeSlot = () => {
        if (selectedTimeSlot) {
            const { shift, timeSlot, day } = selectedTimeSlot;
            const timeSlotLabel = timeSlot === 0 ? 'AB' : 'CD';

            let shiftLabel = '';
            if (shift === 'morning') {
                shiftLabel = 'Manhã';
            } else if (shift === 'afternoon') {
                shiftLabel = 'Tarde';
            } else if (shift === 'night') {
                shiftLabel = 'Noite';
            }

            const dayLabels = {
                monday: 'Segunda-feira',
                tuesday: 'Terça-feira',
                wednesday: 'Quarta-feira',
                thursday: 'Quinta-feira',
                friday: 'Sexta-feira',
                saturday: 'Sábado',
                sunday: 'Domingo'
            };

            const dayLabel = dayLabels[day.toLowerCase()] || day;

            return `${timeSlotLabel} - ${shiftLabel} (${dayLabel})`;
        }
        return '';
    };



    const createShiftTable = (shiftName) => {
        const shiftLabels = {
            morning: 'Manhã',
            afternoon: 'Tarde',
            night: 'Noite',
        };

        return (
            <div className="timetable-table">

                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th colSpan={Object.keys(timetable).length + 1}>
                            <h5 className="shift-title">{shiftLabels[shiftName.toLowerCase()] || shiftName}</h5>
                        </th>
                    </tr>
                    <tr>
                        <th>Horário</th>
                        {Object.keys(timetable).map((day) => (
                            <th key={day}>{daysOfWeek[day]}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {['AB', 'CD'].map((timeSlot, index) => (
                        <tr key={timeSlot}>
                            <td>{timeSlot}</td>
                            {Object.keys(timetable).map((day) => {
                                const className = updatedTimetable[day][shiftName]?.[index];
                                return (
                                    <td key={`${day}-${timeSlot}`} className="table-cell">
                                        {className ? (
                                            <>
                                                <span>{className}</span>
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => handleDeleteSchedule(day, shiftName, index)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleButtonClick(day, shiftName, index)}
                                                className="btn"
                                            >
                                                <AddIcon style={{fontSize: 40, color: 'blue'}}
                                                         titleAccess="Adicionar Disciplina"/>
                                            </button>
                                        )}
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

    const fetchClassInfo = async () => {
        if (classId) {
            try {
                const mockClassInfo = await api.get(`/classes/${classId}`);
                setClassInfo(mockClassInfo.data.class);
                console.log(mockClassInfo.data.class);
            } catch (err) {
                setSnackbar({open: true, message: 'Erro carregar turmas. Tente novamente.', type: 'error'});
            }
        }
    };

    useEffect(() => {

    }, [classInfo]);

    useEffect(() => {
        fetchClassInfo();
        fetchProfessors();
        fetchSubjects();
        fetchClassesSchedule();
    }, [classId]);

    const renderHoursCountTable = () => {

        if (Object.keys(hoursCount).length === 0) {
            return null; // Retorna null para não renderizar nada caso esteja vazio
        }

        return (
            <div className="hours-count-table">
                <h2 className="modern-title">Total de Horas</h2>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Disciplina - Professor</th>
                        <th>Total de Horas</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(hoursCount).map((key) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{hoursCount[key]} hrs</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };


    return (
        <Layout sidebar={<CoordinatorMenu />}>
            <div className="container">
                {classInfo && (
                    <div className="class-info container mt-4">
                        <h2 className="modern-title">Informações da Turma</h2>
                        <table className="table table-bordered">
                            <tbody>
                            <tr>
                                <td className="fw-bold text-secondary">Curso</td>
                                <td>{classInfo.course.name}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-secondary">Descrição</td>
                                <td>{classInfo.description}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-secondary">Semestre</td>
                                <td>{`${classInfo.semester.year} - ${classInfo.semester.semester} (${classInfo.semester.type})`}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-secondary">Data de Início do Semestre</td>
                                <td>{new Date(classInfo.semester.start_date).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-secondary">Data de Fim do Semestre</td>
                                <td>{new Date(classInfo.semester.end_date).toLocaleDateString()}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                <h2 className="modern-title">Horário da Turma</h2>
                {createShiftTable('morning')}
                {createShiftTable('afternoon')}
                {createShiftTable('night')}

                {/* Display the hours count table */}
                {renderHoursCountTable()}

                <ClassScheduleModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    selectedTimeSlot={selectedTimeSlot}
                    formatTimeSlot={formatTimeSlot}
                    disciplines={disciplines}
                    teachers={teachers}
                    selectedDiscipline={selectedDiscipline}
                    setSelectedDiscipline={setSelectedDiscipline}
                    selectedTeacher={selectedTeacher}
                    setSelectedTeacher={setSelectedTeacher}
                    handleSaveSelection={handleSaveSelection}
                />

                <CustomSnackbar
                    type={snackbar.type}
                    message={snackbar.message}
                    duration={6000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                />
            </div>
        </Layout>
    );
};

export default ClassTimetable;
