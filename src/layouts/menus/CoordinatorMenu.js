import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminMenu = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        e.preventDefault(); // Impede o comportamento padrão do Link
        handleLogout();  // Chama a função de logout
        navigate('/login');  // Redireciona para a página de login após o logout
    };

    return (
        <ul className="sidebar-menu">
            <li><Link to="/classes">Turmas</Link></li>
            <li><a href="/logout" onClick={handleLogoutClick}>Sair</a></li>
        </ul>
    );
};

export default AdminMenu;
