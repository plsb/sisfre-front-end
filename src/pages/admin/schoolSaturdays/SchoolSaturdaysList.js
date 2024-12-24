import React, { useEffect, useState } from 'react';
import moment from 'moment'; // Import moment.js
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import SchoolSaturdaysRegistrationPopup from './SchoolSaturdaysRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

const SchoolSaturdaysList = () => {
    const [schoolSaturdays, setSchoolSaturdays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedSchoolSaturday, setSelectedSchoolSaturday] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [schoolSaturdayToDelete, setSchoolSaturdayToDelete] = useState(null);
    const [semesters, setSemesters] = useState([]);

    const getSemesters = async () => {
        try {
            const response = await api.get('/semesters?status=1');
            setSemesters(response.data.semesters || []);
        } catch (err) {
            setError(err);
        }
    };

    const getSchoolSaturdays = async () => {
        let url = `/school-saturdays?page=${page}`;
        if (search) {
            url += `&name=${search}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setSchoolSaturdays(response.data.schoolSaturdays || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        getSchoolSaturdays();
    };

    const handleAddSchoolSaturday = () => {
        setSelectedSchoolSaturday(null);
        setPopupOpen(true);
    };

    const handleSaveSchoolSaturday = () => {
        setPopupOpen(false);
        getSchoolSaturdays();
    };

    const handleEdit = (schoolSaturdayId) => {
        const schoolSaturdayToEdit = schoolSaturdays.find((ss) => ss.id === schoolSaturdayId);
        setSelectedSchoolSaturday(schoolSaturdayToEdit);
        setPopupOpen(true);
    };

    const handleDeleteRequest = (schoolSaturdayId) => {
        setSchoolSaturdayToDelete(schoolSaturdayId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (schoolSaturdayToDelete) {
            try {
                await api.delete(`/school-saturdays/${schoolSaturdayToDelete}`);
                getSchoolSaturdays();
                setSnackbar({ open: true, message: 'Sábado letivo excluído com sucesso!', type: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Erro ao excluir sábado letivo. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setSchoolSaturdayToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSchoolSaturdayToDelete(null);
    };

    useEffect(() => {
        getSchoolSaturdays();
        getSemesters()
    }, [page]);

    return (
        <Layout sidebar={<AdminMenu />}>
            <div className="container mt-4">
                <h4>Lista de Sábados Letivos</h4>
                <div className="d-flex align-items-center gap-3 mb-4">
                    {/*<input
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
                    </button>*/}
                    <button className="btn btn-secondary ms-auto" onClick={handleAddSchoolSaturday}>
                        Cadastrar Novo Sábado Letivo
                    </button>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar sábados letivos: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className="d-none">ID</th>
                                <th>Data</th>
                                <th>Dia da Semana</th>
                                <th>Semestre</th>
                                <th className="text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {schoolSaturdays.length > 0 ? (
                                schoolSaturdays.map((schoolSaturday) => (
                                    <tr key={schoolSaturday.id}>
                                        <td className="d-none">{schoolSaturday.id}</td>
                                        <td>{moment(schoolSaturday.date).format('DD/MM/YYYY')}</td>
                                        {/* Format the date */}
                                        <td>
                                            {
                                                schoolSaturday.weekday === 'segunda' ? 'Segunda' :
                                                    schoolSaturday.weekday === 'terca' ? 'Terça' :
                                                        schoolSaturday.weekday === 'quarta' ? 'Quarta' :
                                                            schoolSaturday.weekday === 'quinta' ? 'Quinta' :
                                                                schoolSaturday.weekday === 'sexta' ? 'Sexta' : ''
                                            }
                                        </td>

                                        <td>
                                            {schoolSaturday.semester
                                                ? `${schoolSaturday.semester.year}.${schoolSaturday.semester.semester} 
       (${schoolSaturday.semester.type === 'regular' ? 'Regular' : 'Convencional'})`
                                                : 'Semestre Não Definido'}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleEdit(schoolSaturday.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteRequest(schoolSaturday.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        Nenhum sábado letivo encontrado
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
                <SchoolSaturdaysRegistrationPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    onSave={handleSaveSchoolSaturday}
                    schoolSaturday={selectedSchoolSaturday}
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
                    message="Tem certeza de que deseja excluir este sábado letivo?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            </div>
        </Layout>
    );
};

export default SchoolSaturdaysList;
