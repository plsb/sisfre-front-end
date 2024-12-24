import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import SemesterRegistrationPopup from './SemesterRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
const moment = require('moment');

const SemesterList = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [semesterToDelete, setSemesterToDelete] = useState(null);

    const getSemesters = async () => {
        let url = `/semesters?page=${page}`;
        if (search) {
            url += `&year=${search}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setSemesters(response.data.semesters || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        getSemesters();
    };

    const handleAddSemester = () => {
        setSelectedSemester(null);
        setPopupOpen(true);
    };

    const handleSaveSemester = () => {
        setPopupOpen(false);
        getSemesters();
    };

    const handleEdit = (semesterId) => {
        const semesterToEdit = semesters.find((semester) => semester.id === semesterId);
        setSelectedSemester(semesterToEdit);
        setPopupOpen(true);
    };

    const handleDeleteRequest = (semesterId) => {
        setSemesterToDelete(semesterId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (semesterToDelete) {
            try {
                await api.delete(`/semesters/${semesterToDelete}`);
                getSemesters();
                setSnackbar({ open: true, message: 'Semestre deletado com sucesso!', type: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Erro ao deletar o semestre. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setSemesterToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSemesterToDelete(null);
    };

    useEffect(() => {
        getSemesters();
    }, [page]);

    const formatDate = (dateString) => {
        const formattedDate = moment(dateString).format('DD/MM/YYYY');
        return formattedDate;
    }

    return (
        <Layout sidebar={<AdminMenu/>}>
            <div className="container mt-4">
                <h4>Lista de Semestres</h4>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pesquisar por ano"
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
                    <button className="btn btn-secondary ms-auto" onClick={handleAddSemester}>
                        Cadastrar Novo Semestre
                    </button>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar semestres: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className="d-none">ID</th>
                                <th>Ano</th>
                                <th>Semestre</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Período</th>
                                <th className="text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {semesters.length > 0 ? (
                                semesters.map((semester) => (
                                    <tr
                                        key={semester.id}
                                        className={semester.status ? 'table-success' : 'table-danger'}
                                    >
                                        <td className="d-none">{semester.id}</td>
                                        <td>{semester.year}</td>
                                        <td>{semester.semester}</td>
                                        <td>{semester.type === 'regular' ? 'Regular' : 'Convencional'}</td>
                                        <td>{semester.status ? 'Ativo' : 'Inativo'}</td>
                                        <td>{`${formatDate(semester.start_date)} - ${formatDate(semester.end_date)}`}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleEdit(semester.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteRequest(semester.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        Nenhum semestre encontrado
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
                <SemesterRegistrationPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    onSave={handleSaveSemester}
                    semester={selectedSemester}
                />
            </div>
            <CustomSnackbar
                type={snackbar.type}
                message={snackbar.message}
                duration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
            />
            <ConfirmationDialog
                open={deleteDialogOpen}
                title="Confirmar Exclusão"
                message="Tem certeza de que deseja excluir este semestre?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </Layout>
    );
};

export default SemesterList;
