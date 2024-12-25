import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import HolidaysRegistrationPopup from './HolidaysRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { formatDate } from "../../../utils/utils";
import { Edit, Delete, Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

const HolidaysList = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [holidayToDelete, setHolidayToDelete] = useState(null);

    const getHolidays = async () => {
        let url = `/holidays?page=${page}`;
        if (search) {
            url += `&name=${search}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setHolidays(response.data.holidays || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        getHolidays();
    };

    const handleAddHoliday = () => {
        setSelectedHoliday(null);
        setPopupOpen(true);
    };

    const handleSaveHoliday = () => {
        setPopupOpen(false);
        getHolidays();
    };

    const handleEdit = (holidayId) => {
        const holidayToEdit = holidays.find((holiday) => holiday.id === holidayId);
        setSelectedHoliday(holidayToEdit);
        setPopupOpen(true);
    };

    const handleDeleteRequest = (holidayId) => {
        setHolidayToDelete(holidayId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (holidayToDelete) {
            try {
                await api.delete(`/holidays/${holidayToDelete}`);
                getHolidays();
                setSnackbar({ open: true, message: 'Feriado deletado com sucesso!', type: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Erro ao deletar o feriado. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setHolidayToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setHolidayToDelete(null);
    };

    useEffect(() => {
        getHolidays();
    }, [page]);

    return (
        <Layout sidebar={<AdminMenu />}>
            <div className="container mt-4">
                <h4 className='text-start'>Feriados</h4>
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
                    <button className="btn" onClick={handleSearch}>
                        <Search style={{ fontSize: 40, color: 'green' }} titleAccess='Pesquisar Feriado' />
                    </button>
                    <button className="btn ms-auto" onClick={handleAddHoliday}>
                        <AddIcon style={{ fontSize: 40, color: 'blue' }} titleAccess='Cadastrar Novo Feriado' />
                    </button>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar feriados: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Data</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holidays.length > 0 ? (
                                    holidays.map((holiday) => (
                                        <tr key={holiday.id}>
                                            <td className="text-truncate">{holiday.name}</td> {/* Quebra longa em espaços limitados */}
                                            <td>{formatDate(holiday.date)}</td>
                                            <td className="text-center">
                                                <button className="btn p-1" onClick={() => handleEdit(holiday.id)}>
                                                    <Edit style={{ fontSize: 20, color: 'blue' }} titleAccess="Editar Feriado" />
                                                </button>
                                                <button className="btn p-1" onClick={() => handleDeleteRequest(holiday.id)}>
                                                    <Delete style={{ fontSize: 20, color: 'red' }} titleAccess="Excluir Feriado" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">Nenhum feriado encontrado</td>
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
                <HolidaysRegistrationPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    onSave={handleSaveHoliday}
                    holiday={selectedHoliday}
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
                message="Tem certeza de que deseja excluir este feriado?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </Layout>
    );
};

export default HolidaysList;
