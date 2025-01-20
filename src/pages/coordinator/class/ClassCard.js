import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const ClassCard = ({
                       classItem,
                       onEdit,
                       onDelete
                   }) => {
    const navigate = useNavigate();

    const handleMontarHorario = () => {
        navigate(`/class-timetable/${classItem.id}`);
    };

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
                    <button className="btn btn-primary" onClick={handleMontarHorario}>
                        <i className="fa fa-plus"></i> Montar Horário
                    </button>
            </div>
        </div>
    );
};

ClassCard.propTypes = {
    classItem: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        course: PropTypes.shape({
            acronym: PropTypes.string
        }),
        semester: PropTypes.shape({
            year: PropTypes.number,
            semester: PropTypes.number,
            type: PropTypes.string
        }),
        classSchedules: PropTypes.arrayOf(PropTypes.object),
        capacity: PropTypes.number,
        schedule: PropTypes.string,
        instructor: PropTypes.string
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ClassCard;
