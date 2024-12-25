// hooks/useAuth.js
import { useState } from 'react';
import { login as apiLogin } from '../services/api';  // Função de login da API
import { useNavigate } from 'react-router-dom';  // Importação correta do hook useNavigate
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // O useNavigate() deve estar dentro do contexto do Router

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiLogin(email, password);
            const { token } = response;

            // Armazenando o token JWT no localStorage para controle de sessão
            localStorage.setItem('token', token);

            // Redireciona para a página admin após login bem-sucedido
            navigate('/');  // O navigate() redireciona para o AdminMenu
        } catch (err) {
            setError('Erro ao autenticar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');  // Redireciona para o login após logout
    };

    // Verifica se o usuário está autenticado com base na presença do token no localStorage
    const isAuthenticated = !!localStorage.getItem('token');

    const token = localStorage.getItem('token');
    let decodedToken = {};
    if (token) {
        try {
            decodedToken = jwtDecode(token);  // Decodifica o token JWT
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
        }
    }
    const roles = decodedToken?.accessType || '';

    return { handleLogin, handleLogout, loading, error, isAuthenticated, roles };
};

export default useAuth;
