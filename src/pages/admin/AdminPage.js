import React from 'react';
import AdminMenu from "../../layouts/menus/AdminMenu";
import Layout from "../../layouts/Layout";

const AdminPage = () => {
    return (
        <Layout sidebar={<AdminMenu />}>
            <h1>Bem-vindo ao Painel Administrativo</h1>
            <p>Conteúdo principal da página aqui.</p>
        </Layout>
    );
};

export default AdminPage;
