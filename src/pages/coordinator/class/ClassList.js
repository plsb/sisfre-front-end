import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import ClassRegistrationPopup from './ClassRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import CoordinatorMenu from "../../../layouts/menus/CoordinatorMenu";

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

    const getClasses = async () => {
        let url = `/classes?page=${page}`;
        if (search) {
            url += `&description=${search}`;
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
        <Layout sidebar={<CoordinatorMenu />}>
            <div className="container mt-4">
                <h4>Lista de Turmas</h4>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pesquisar por descrição"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>
                        Pesquisar
                    </button>
                    <button className="btn btn-secondary ms-auto" onClick={handleAddClass}>
                        Cadastrar Nova Turma
                    </button>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar turmas: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className="d-none">ID</th>
                                <th>Descrição</th>
                                <th>Curso</th>
                                <th>Semestre</th>
                                <th className="text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {classes.length > 0 ? (
                                classes.map((classItem) => (
                                    <tr key={classItem.id}>
                                        <td className="d-none">{classItem.id}</td>
                                        <td>{classItem.description}</td>
                                        <td>{classItem.course?.name}</td>
                                        <td>{classItem.semester?.year+'.'+classItem.semester?.semester+' ('+classItem.semester?.type+')'}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleEdit(classItem.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteRequest(classItem.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        Nenhuma classe encontrada
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="d-flex justify-content-center mt-3">
                    <nav>
                        <ul className="pagination">
                            {[...Array(totalPages).keys()].map((_, idx) => (
                                <li
                                    key={idx}
                                    className={`page-item ${page === idx + 1 ? 'active' : ''}`}
                                    onClick={() => setPage(idx + 1)}
                                >
                                    <button className="page-link">{idx + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
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
            </div>
        </Layout>
    );
};

export default ClassList;
