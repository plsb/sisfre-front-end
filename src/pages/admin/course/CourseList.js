import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import CourseRegistrationPopup from './CourseRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog'; // Importing ConfirmationDialog for delete confirmation

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const getCourses = async () => {
        let url = `/courses?page=${page}`;
        if (search) {
            url += `&name=${search}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setCourses(response.data.courses || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const getUsers = async () => {
        try {
            const response = await api.get('/users/all');
            setUsers(response.data.users || []);
        } catch (err) {
            setError(err);
        }
    };

    const handleSearch = () => {
        setPage(1);
        getCourses();
    };

    const handleAddCourse = () => {
        setSelectedCourse(null);
        setPopupOpen(true);
    };

    const handleSaveCourse = () => {
        setPopupOpen(false);
        getCourses();
    };

    const handleEdit = (courseId) => {
        const courseToEdit = courses.find((course) => course.id === courseId);
        setSelectedCourse(courseToEdit);
        setPopupOpen(true);
    };

    const handleDeleteRequest = (courseId) => {
        setCourseToDelete(courseId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (courseToDelete) {
            try {
                await api.delete(`/courses/${courseToDelete}`);
                getCourses();
                setSnackbar({ open: true, message: 'Curso deletado com sucesso!', type: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Erro ao deletar o curso. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
    };

    useEffect(() => {
        getCourses();
        getUsers();
    }, [page]);

    return (
        <Layout sidebar={<AdminMenu />}>
            <div className="container mt-4">
                <h4>Lista de Cursos</h4>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pesquisar por nome"
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
                    <button className="btn btn-secondary ms-auto" onClick={handleAddCourse}>
                        Cadastrar Novo Curso
                    </button>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar cursos: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className="d-none">ID</th>
                                <th>Nome</th>
                                <th>Sigla</th>
                                <th>Tipo</th>
                                <th>Coordenador</th>
                                <th className="text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course.id}>
                                        <td className="d-none">{course.id}</td>
                                        <td>{course.name}</td>
                                        <td>{course.acronym}</td>
                                        <td>{course.type === 'G' ? 'Graduação' : course.type === 'I' ? 'Integrado' : 'Técnico'}</td>
                                        <td>{course.coordinator ? course.coordinator.username : '-'}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleEdit(course.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteRequest(course.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        Nenhum curso encontrado
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
                <CourseRegistrationPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    onSave={handleSaveCourse}
                    course={selectedCourse}
                    users={users}
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
                    message="Tem certeza de que deseja excluir este curso?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            </div>
        </Layout>
    );
};

export default CourseList;
