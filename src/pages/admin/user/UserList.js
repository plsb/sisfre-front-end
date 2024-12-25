import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import UserRegistrationPopup from './UserRegistrationPopup';
import CustomSnackbar from '../../../components/CustomSnackbar';
import ConfirmationDialog from '../../../components/ConfirmationDialog'; // Importando o componente
import { Edit, Delete,Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const getUsers = async () => {
        let url = `/users?page=${page}`;
        if (search) {
            url += `&username=${search}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setUsers(response.data.users || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        getUsers();
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setPopupOpen(true);
    };

    const handleSaveUser = () => {
        setPopupOpen(false);
        getUsers();
    };

    const handleEdit = (userId) => {
        const userToEdit = users.find((user) => user.id === userId);
        setSelectedUser(userToEdit);
        setPopupOpen(true);
    };

    const handleDeleteRequest = (userId) => {
        setUserToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                await api.delete(`/users/${userToDelete}`);
                getUsers();
                setSnackbar({ open: true, message: 'Usuário deletado com sucesso!', type: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Erro ao deletar o usuário. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    useEffect(() => {
        getUsers();
    }, [page]);

    return (
        <Layout sidebar={<AdminMenu />}>
            <div className="container mt-4">
                <h4 className='text-start'>Usuários</h4>
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
                        <Search style={{ fontSize: 40, color: 'green' }} titleAccess='Pesquisar Usuário' />
                    </button>
                    <button className="btn ms-auto" onClick={handleAddUser}>
                        <AddIcon style={{fontSize:40,color:'blue'}} titleAccess='Cadastrar Novo Usuário' />
                    </button>
                </div>
                {loading ? (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{`Erro ao carregar usuários: ${JSON.stringify(error)}`}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className="d-none">ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th className="text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="d-none">{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn"
                                                onClick={() => handleEdit(user.id)}
                                            >
                                                <Edit style={{ fontSize: 24, color: 'blue' }} titleAccess='Editar Usuário' />
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => handleDeleteRequest(user.id)}
                                            >
                                                <Delete style={{ fontSize: 24, color: 'red' }} titleAccess='Excluir Usuário' />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        Nenhum usuário encontrado
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
                <UserRegistrationPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    onSave={handleSaveUser}
                    user={selectedUser}
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
                message="Tem certeza de que deseja excluir este usuário?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </Layout>
    );
};

export default UserList;
