import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Button,
    IconButton,
    TextField,
    Box,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AdminMenu from "../../../layouts/menus/AdminMenu";
import Layout from "../../../layouts/Layout";
import UserRegistrationPopup from './UserRegistrationPopup'; // Import the popup component
import CustomSnackbar from '../../../components/CustomSnackbar'; // Import the Snackbar component

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1); // State for current page
    const [totalPages, setTotalPages] = useState(1); // State for total pages
    const [popupOpen, setPopupOpen] = useState(false); // State to handle popup visibility
    const [selectedUser, setSelectedUser] = useState(null); // State to hold selected user data for editing
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' }); // Snackbar state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
    const [userToDelete, setUserToDelete] = useState(null); // State for the user to delete

    const getUsers = async () => {
        let url = `/users?page=${page}`;
        if (search) {
            url += `&username=${search}`;
        }
        try {
            setLoading(true);
            const response = await api.get(url);
            setUsers(response.data);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1); // Reset to first page when searching
        getUsers();  // Fetch users based on search
    };

    const handleAddUser = () => {
        setSelectedUser(null); // Ensure no user is selected when adding a new user
        setPopupOpen(true); // Open the popup for new user registration
    };

    const handleSaveUser = (newUser) => {
        console.log('New User:', newUser);
        // Add logic to save the new user, e.g., call an API or update the state
        setPopupOpen(false);
    };

    const handleEdit = (userId) => {
        const userToEdit = users.find((user) => user.id === userId);
        setSelectedUser(userToEdit); // Set the selected user for editing
        setPopupOpen(true); // Open the popup for editing
    };

    const handleDeleteRequest = (userId) => {
        setUserToDelete(userId); // Set the user to delete
        setDeleteDialogOpen(true); // Open the delete confirmation dialog
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                // Make the DELETE request to the API
                await api.delete(`/users/${userToDelete}`);

                // Remove the user from the local state without needing to fetch the list again
                setUsers((prevUsers) => ({
                    ...prevUsers,
                    users: prevUsers.users.filter((user) => user.id !== userToDelete),
                }));

                // Show success message
                setSnackbar({ open: true, message: 'Usuário deletado com sucesso!', type: 'success' });
            } catch (err) {
                // Handle error (optional: show an error message)
                setSnackbar({ open: true, message: 'Erro ao deletar o usuário. Tente novamente.', type: 'error' });
            }
        }
        setDeleteDialogOpen(false); // Close the dialog after the action
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false); // Close the dialog without deleting
    };

    // Run getUsers whenever search or page changes
    useEffect(() => {
        if (search || page) {
            getUsers();
        }
    }, [page]);

    return (
        <Layout sidebar={<AdminMenu />}>
            <div style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Lista de Usuários
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <TextField
                        label="Pesquisar por nome"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        Pesquisar
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAddUser}
                    >
                        Cadastrar Novo Usuário
                    </Button>
                </Box>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">
                        {`Erro ao carregar usuários: ${typeof error === 'string' ? error : JSON.stringify(error)}`}
                    </Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users?.users?.length > 0 ? (
                                    users.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(user.id)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => handleDeleteRequest(user.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>Nenhum usuário encontrado</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
                <UserRegistrationPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    onSave={handleSaveUser}
                    user={selectedUser}  // Pass the selected user to the popup for editing
                />
            </div>

            {/* Display Snackbar for success or error messages */}
            <CustomSnackbar
                type={snackbar.type}
                message={snackbar.message}
                duration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <Typography>Tem certeza de que deseja excluir este usuário?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default UserList;
