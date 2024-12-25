// src/components/AccessDenied.js
import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div style={styles.container}>
            <h2>Acesso Não Autorizado</h2>
            <p>Você não tem permissão para acessar esta página.</p>
            <Link to="/login" style={styles.link}>Ir para Login</Link>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#f2f2f2',
        borderRadius: '8px',
        marginTop: '20px',
    },
    link: {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        marginTop: '20px',
    },
};

export default AccessDenied;
