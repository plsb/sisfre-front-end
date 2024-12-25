import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import SubjectRegistrationPopup from './SubjectRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { Edit, Delete,Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);

    const getSubjects = async () => {
        let url = `/subjects?page=${page}`;
        if (search) {
            url += `&name=${search}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setSubjects(response.data.subjects || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        getSubjects();
    };

    const handleAddSubject = () => {
        setSelectedSubject(null);
        setPopupOpen(true);
    };

    const handleSaveSubject = () => {
        setPopupOpen(false);
        getSubjects();
    };

    const handleEdit = (subjectId) => {
        const subjectToEdit = subjects.find((subject) => subject.id === subjectId);
        setSelectedSubject(subjectToEdit);
        setPopupOpen(true);
    };

    const handleDeleteRequest = (subjectId) => {
        setSubjectToDelete(subjectId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (subjectToDelete) {
            try {
                await api.delete(`/subjects/${subjectToDelete}`);
                getSubjects();
                setSnackbar({ open: true, message: 'Disciplina deletada com sucesso!', type: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Erro ao deletar a disciplina. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setSubjectToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSubjectToDelete(null);
    };

    useEffect(() => {
        getSubjects();
    }, [page]);

    return (
        <Layout sidebar={<AdminMenu />}>
            <div className="container mt-4">
                <h4 className='text-start'>Disciplinas</h4>
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
                    <button className="btn" onClick={handleSearch}>
                        <Search style={{ fontSize: 40, color: 'green' }} titleAccess='Pesquisar Disciplina' />
                    </button>
                    <button className="btn ms-auto" onClick={handleAddSubject}>
                    <AddIcon style={{fontSize:40,color:'blue'}} titleAccess='Cadastrar Nova Disciplina' />
                    </button>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar matérias: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className="d-none">ID</th>
                                <th>Descrição</th>
                                <th>Sigla</th>
                                <th className="text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subjects.length > 0 ? (
                                subjects.map((subject) => (
                                    <tr key={subject.id}>
                                        <td className="d-none">{subject.id}</td>
                                        <td>{subject.name}</td>
                                        <td>{subject.acronym}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn"
                                                onClick={() => handleEdit(subject.id)}
                                            >
                                                <Edit style={{ fontSize: 24, color: 'blue' }} titleAccess='Editar Disciplina' />
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => handleDeleteRequest(subject.id)}
                                            >
                                                <Delete style={{ fontSize: 24, color: 'red' }} titleAccess='Excluir Disciplina' />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        Nenhuma disciplina encontrada
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
                <SubjectRegistrationPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    onSave={handleSaveSubject}
                    subject={selectedSubject}
                />
            </div>
            <CustomSnackbar
                type={snackbar.type}
                message={snackbar.message}
                duration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
            <ConfirmationDialog
                open={deleteDialogOpen}
                title="Confirmar Exclusão"
                message="Tem certeza de que deseja excluir esta disciplina?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </Layout>
    );
};

export default SubjectList;
