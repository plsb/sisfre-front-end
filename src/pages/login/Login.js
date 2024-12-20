import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import './login.css'; // Importe o CSS do template

const Login = () => {
    const { handleLogin, error, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Controle para alternar entre login e cadastro

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin); // Alterna entre login e cadastro
    };

    return (
        <div className="login-page">
            <div className="form">
                {isLogin ? (
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Carregando...' : 'Entrar'}
                        </button>
                        {error && <p>{error}</p>}
                        <p className="message">
                            Esquecei a senha?{' '}
                            <a href="#" onClick={toggleForm}>
                                Clique aqui.
                            </a>
                        </p>
                    </form>
                ) : (
                    <form className="register-form">
                        <input type="text" placeholder="Nome" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Senha" required />
                        <button type="submit">Criar Conta</button>
                        <p className="message">
                            Já tem uma conta?{' '}
                            <a href="#" onClick={toggleForm}>
                                Entrar
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
