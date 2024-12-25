import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import AdminMenu from '../layouts/menus/AdminMenu';
import AdminPage from "../pages/admin/AdminPage";
import UserList from "../pages/admin/user/UserList";
import CourseList from "../pages/admin/course/CourseList";
import SubjectList from "../pages/admin/subject/SubjectList";
import SemesterList from "../pages/admin/semester/SemesterList";
import SchoolSaturdaysList from "../pages/admin/schoolSaturdays/SchoolSaturdaysList";
import HolidaysList from "../pages/admin/holidays/HolidaysList";
import ProtectedRoute from './ProtectedRoute';
import ClassList from "../pages/coordinator/class/ClassList";
import AccessDenied from "../layouts/AccessDenied";
import CoordinatorMenu from "../layouts/menus/CoordinatorMenu";
import useAuth from "../hooks/useAuth";

const AppRoutes = () => {
    const { roles } = useAuth();

    const menu = roles === 'admin' ? <AdminMenu /> : roles === 'coordinator' ? <CoordinatorMenu /> : null;

    return (
        <Routes>
            {/* Rota de Login */}
            <Route path="/login" element={<Login />} />

            <Route path="/unauthorized" element={<AccessDenied />} />

            {/* Rotas protegida para Admin */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={[roles]}>
                        {menu || <AccessDenied />}
                    </ProtectedRoute>
                }
            />

            <Route
                path="/users"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <UserList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <CourseList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/subjects"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <SubjectList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/semesters"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <SemesterList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/schoolsatudays"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <SchoolSaturdaysList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/holidays"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <HolidaysList />
                    </ProtectedRoute>
                }
            />

            {/* Rotas protegida para Coordenador */}
            <Route
                path="/classes"
                element={
                    <ProtectedRoute allowedRoles={['coordinator']}>
                        <ClassList />
                    </ProtectedRoute>
                }
            />


        </Routes>
    );
};

export default AppRoutes;

