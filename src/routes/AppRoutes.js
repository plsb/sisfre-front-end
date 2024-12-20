import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import AdminMenu from '../layouts/menus/AdminMenu';
import useAuth from '../hooks/useAuth';
import AdminPage from "../pages/admin/AdminPage";
import UserList from "../pages/admin/user/UserList";

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Rota de Login */}
            <Route path="/login" element={
                    <Login />
            } />

            {/* Rota do Admin */}
            <Route
                path="/admin"
                element={isAuthenticated ? <AdminPage /> : <Login />}
            />

            <Route
                path="/"
                element={isAuthenticated ? <AdminMenu /> : <Login />}
            />

            <Route path="/users" element={isAuthenticated ? <UserList /> : <Login />} />
        </Routes>
    );
};

export default AppRoutes;
