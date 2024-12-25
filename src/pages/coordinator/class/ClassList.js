import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import ClassRegistrationPopup from './ClassRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import CoordinatorMenu from "../../../layouts/menus/CoordinatorMenu";
import ClassCard from './ClassCard';
import {Search} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    const getClasses = async () => {
        let url = `/classes?page=${page}`;
        if (search) {
            url += `&description=${search}`;
        }
        if (selectedCourse) {
            url += `&courseId=${selectedCourse}`;
        }
        if (selectedSemester) {
            url += `&semesterId=${selectedSemester}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setClasses(response.data.classes || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const getCourses = async () => {
        try {
            const response = await api.get('/classes/courses-coordinates');
            setCourses(response.data.courses || []);
        } catch (err) {
            setError(err);
        }
    };

    const getSemesters = async () => {
        try {
            const response = await api.get('/all/semesters');
            setSemesters(response.data.semesters || []);
        } catch (err) {
            setError(err);
        }
    };

    const handleSearch = () => {
        setPage(1);
        getClasses();
    };

    const handleAddClass = () => {
        setSelectedClass(null);
        setPopupOpen(true);
    };

    const handleSaveClass = () => {
        setPopupOpen(false);
        getClasses();
    };

    const handleEdit = (classId) => {
        const classToEdit = classes.find((classItem) => classItem.id === classId);
        setSelectedClass(classToEdit);
        setPopupOpen(true);
    };

    const handleDeleteRequest = (classId) => {
        setClassToDelete(classId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (classToDelete) {
            try {
                await api.delete(`/classes/${classToDelete}`);
                getClasses();
                setSnackbar({ open: true, message: 'Classe deletada com sucesso!', type: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Erro ao deletar a classe. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setClassToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setClassToDelete(null);
    };

    useEffect(() => {
        getClasses();
        getCourses();
        getSemesters();
    }, [page]);

    return (
        <Layout sidebar={<CoordinatorMenu/>}>
            <div className="container mt-4">
                <h4 className='text-start'>Turmas</h4>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <select
                        className="form-control"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Selecione o curso</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="form-control"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option value="">Selecione o semestre</option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester?.year}.{semester?.semester} ({semester?.type})
                            </option>
                        ))}
                    </select>
                    <button className="btn" onClick={handleSearch}>
                        <Search style={{fontSize: 40, color: 'green'}} titleAccess='Pesquisar Turma'/>
                    </button>
                    <button className="btn ms-auto" onClick={handleAddClass}>
                        <AddIcon style={{fontSize: 40, color: 'blue'}} titleAccess='Cadastrar Nova Turma'/>
                    </button>
                </div>

                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar turmas: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="row">
                        {classes.length > 0 ? (
                            classes.map((classItem) => (
                                <div className="col-md-4" key={classItem.id}>
                                    <ClassCard
                                        classItem={classItem}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteRequest}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                Nenhuma turma encontrada.
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ClassRegistrationPopup
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                onSave={handleSaveClass}
                classItem={selectedClass}
                courses={courses}
                semesters={semesters}
            />
            <CustomSnackbar
                type={snackbar.type}
                message={snackbar.message}
                duration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
            <ConfirmationDialog
                open={deleteDialogOpen}
                title="Confirmar Exclusão"
                message="Tem certeza de que deseja excluir esta classe?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </Layout>
    );
};

export default ClassList;
