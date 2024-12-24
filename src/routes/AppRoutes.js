import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import AdminMenu from '../layouts/menus/AdminMenu';
import useAuth from '../hooks/useAuth';
import AdminPage from "../pages/admin/AdminPage";
import UserList from "../pages/admin/user/UserList";
import CourseList from "../pages/admin/course/CourseList";
import SubjectList from "../pages/admin/subject/SubjectList";
import SemesterList from "../pages/admin/semester/SemesterList";
import SchoolSaturdaysList from "../pages/admin/schoolSaturdays/SchoolSaturdaysList";
import HolidaysList from "../pages/admin/holidays/HolidaysList";

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

            <Route path="/courses" element={isAuthenticated ? <CourseList /> : <Login />} />

            <Route path="/subjects" element={isAuthenticated ? <SubjectList /> : <Login />} />

            <Route path="/semesters" element={isAuthenticated ? <SemesterList /> : <Login />} />

            <Route path="/schoolsatudays" element={isAuthenticated ? <SchoolSaturdaysList /> : <Login />} />

            <Route path="/holidays" element={isAuthenticated ? <HolidaysList /> : <Login />} />
        </Routes>
    );
};

export default AppRoutes;
