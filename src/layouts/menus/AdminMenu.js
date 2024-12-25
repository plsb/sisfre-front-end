import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

const AdminMenu = () => {

    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        e.preventDefault(); // Impede o comportamento padrão do Link
        handleLogout();  // Chama a função de logout
        navigate('/login');  // Redireciona para a página de login após o logout
    };

    return (
        <div>
            
            <div>
                <ul className="sidebar-menu">
                    <li><Link to="/courses">Cursos</Link></li>
                    <li><Link to="/subjects">Disciplinas</Link></li>
                    <li><Link to="/holidays">Feriados</Link></li>
                    <li><Link to="/schoolsatudays">Sábados Letivos</Link></li>
                    <li><Link to="/semesters">Semestres Letivos</Link></li>
                    <li><Link to="/users">Usuários</Link></li>
                    <li><a href="/logout" onClick={handleLogoutClick}>Sair</a></li>
                </ul>
            </div>
        </div>
    );
};

export default AdminMenu;
