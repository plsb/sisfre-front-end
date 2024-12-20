import React from 'react';
import './layout.css';

const Layout = ({ children, sidebar }) => {
    return (
        <div className="layout-container">
            {/* Top Bar */}
            <div className="topbar">
                <div className="sidebar-header">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="logo"
                    />
                </div>
            </div>

            {/* Layout principal com Sidebar e Content */}
            <div className="main-content">
                {/* Sidebar */}
                <div className="sidebar">
                    {sidebar} {/* Renderiza o conteúdo passado para a prop sidebar */}
                </div>

                {/* Content */}
                <div className="content">
                    {children} {/* Renderiza o conteúdo da página */}
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <p>&copy; 2024 Your Company - All Rights Reserved</p>
            </div>
        </div>
    );
};

export default Layout;
