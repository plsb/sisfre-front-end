import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Delete, Edit} from "@mui/icons-material";

const ClassCard = ({
                       classItem,
                       onEdit,
                       onDelete
                   }) => {
    return (
        <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-0">{classItem.description}</h5>
                    <p className="text-muted mb-0">
                        {classItem.course?.acronym} - {classItem.semester?.year}.{classItem.semester?.semester} ({classItem.semester?.type})
                    </p>
                </div>
                <div>
                    <button
                        className="btn"
                        onClick={() => onEdit(classItem.id)}
                    >
                        <Edit style={{ fontSize: 24, color: 'blue' }} titleAccess='Editar Curso' />
                    </button>
                    <button
                        className="btn"
                        onClick={() => onDelete(classItem.id)}
                    >
                        <Delete style={{ fontSize: 24, color: 'red' }} titleAccess='Excluir Curso' />
                    </button>
                </div>
            </div>
            <div className="card-body">
                {classItem.classSchedules.length === 0 && (
                    <button className="btn btn-primary">
                        <i className="fa fa-plus"></i> Montar Horário
                    </button>)}

            </div>
        </div>
    );
};

ClassCard.propTypes = {
    classItem: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        course: PropTypes.shape({
            name: PropTypes.string
        }),
        semester: PropTypes.shape({
            year: PropTypes.number,
            semester: PropTypes.number,
            type: PropTypes.string
        }),
        capacity: PropTypes.number,
        schedule: PropTypes.string,
        instructor: PropTypes.string
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ClassCard;
