import React from 'react';
import { Link } from 'react-router-dom';

const AdminMenu = () => {
    return (
        <ul className="sidebar-menu">
            <li><Link to="/courses">Cursos</Link></li>
            <li><Link to="/semesters">Semestres Letivos</Link></li>
            <li><Link to="/schoolsatudays">Sábados Letivos</Link></li>
            <li><Link to="/subjects">Disciplinas</Link></li>
            <li><Link to="/users">Usuários</Link></li>
            <li><Link to="/logout">Sair</Link></li>
        </ul>
    );
};

export default AdminMenu;
