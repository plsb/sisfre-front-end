import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmationDialog = ({
                                open,
                                title,
                                message,
                                onConfirm,
                                onCancel,
                                confirmText = 'Confirmar',
                                cancelText = 'Cancelar',
                            }) => {
    if (!open) return null;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel}>
                            {cancelText}
                        </button>
                        <button className="btn btn-danger" onClick={onConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
