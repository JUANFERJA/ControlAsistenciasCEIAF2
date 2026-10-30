import React, { useContext, useMemo, useState } from 'react';
import { dateData } from '../data/dateData';
import { DataContext } from '../context/DataContext';
import { generalFunctions } from '../helpers/generalFunctions';
import '../styles/horariosPageStyle.scss';
import Swal from 'sweetalert2';
import { OperationHorarioModal } from '../components/Modales/OperationHorarioModal';



const HorariosPage = () => {
    const { dias } = dateData();
    const { guardarContenido, alertError, actualizarContenido } = generalFunctions();
    const { horarios, cursos, docentes } = useContext(DataContext);
    const [isOpenCrear, setIsOpenCrear] = useState(false);
    const [isOpenEditar, setIsOpenEditar] = useState(false);
    const [form, setForm] = useState({
        idCurso: cursos[0]?.id || '',
        dia: 1,
        horaIngreso: '08:00:00',
        horaSalida: '09:30:00',
        fechaDesde: '',
        fechaHasta: ''
    });

    const validarFechaRango = () => {
        if (!form.fechaDesde || !form.fechaHasta) {
            alertError('Debes completar la fecha desde y hasta para el horario.');
            return false;
        }

        const fechaDesde = new Date(`${form.fechaDesde}T12:00:00`);
        const fechaHasta = new Date(`${form.fechaHasta}T12:00:00`);

        if (fechaDesde > fechaHasta) {
            alertError('La fecha desde no puede ser mayor que la fecha hasta.');
            return false;
        }

        return true;
    };

    const handleSubmitCrear = (e) => {
        e.preventDefault();

        if (!validarFechaRango()) return;

        let urlGuardarCursos = `Horario/crear-horario`;
        let existingHorario = horarios.filter(h => h.dia === form.dia && h.idCurso == form.idCurso)
       
        if (existingHorario.length > 0) {
            alertError("Ya esxiste un registro para ese día y para el curso especificado...");
            return;
        }
        guardarContenido(urlGuardarCursos, form);
        setForm({ ...form, id: 0, fechaDesde: '', fechaHasta: '' })
        setIsOpenCrear(false);
    };
    const handleSubmitEditar = (e) => {
        e.preventDefault();

        if (!validarFechaRango()) return;

        let urlActualizaHorario = `Horario/actualizar-horario`;       
        actualizarContenido(urlActualizaHorario, form);
        setForm({ ...form, id: 0, fechaDesde: '', fechaHasta: '' })
        setIsOpenEditar(false);
    };
    const activeModal = (id, idCurso, dia, horaIngreso, horaSalida, fechaDesde = '', fechaHasta = '') =>{
        let data = {
            id,
            idCurso,
            dia,
            horaIngreso,
            horaSalida,
            fechaDesde,
            fechaHasta
        }       
        setForm(data)
        setIsOpenEditar(true);

    }
    return (
        <div className="horarios-page">


            <div className="horarios-container">
                <div className="horarios-header">
                    <h1>Horarios</h1>
                    <button className="save-btn" onClick={() => setIsOpenCrear(true)}>
                        + Nuevo horario
                    </button>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Curso</th>
                                {dias.map((dia) => (
                                    <th key={dia}>{dia.descripcion}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.map((curso) => (
                                <tr key={curso.id}>
                                    <td className="curso-cell">
                                        <div className="curso-info">
                                            <span className="curso-nombre">{curso.nombre}</span>
                                            {(() => {
                                                const docente = docentes?.find(d => Number(d.idCurso) === Number(curso.id));
                                                return docente ? (
                                                    <small className="curso-docente">
                                                        {docente.nombre} {docente.apellido}
                                                    </small>
                                                ) : null;
                                            })()}
                                        </div>
                                    </td>
                                     
                                    {dias.map((dia) => (
                                        <td key={`${curso.id}-${dia.id}`}>
                                            {horarios.find(h => h.idCurso == curso.id && h.dia == dia.id) ?
                                                (() => {
                                                    const horario = horarios.find(h => h.idCurso == curso.id && h.dia == dia.id);
                                                    return (
                                                        <span className="badge">
                                                            {horario.horaIngreso.slice(0, 5)}-
                                                            {horario.horaSalida.slice(0, 5)}
                                                            <button
                                                                type="button"
                                                                className="edit-btn"
                                                                onClick={() => activeModal(
                                                                    horario.id,
                                                                    curso.id,
                                                                    dia.id,
                                                                    horario.horaIngreso,
                                                                    horario.horaSalida,
                                                                    horario.fechaDesde,
                                                                    horario.fechaHasta
                                                                )}
                                                                title="Editar horario"
                                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}
                                                            >
                                                                ✏️
                                                            </button>
                                                        </span>
                                                    );
                                                })() :
                                                (<span>--:--</span>)}

                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpenCrear && (<OperationHorarioModal params={{form, setIsOpen: setIsOpenCrear, setForm, handleSubmit: handleSubmitCrear, cursos, dias}} />)}
            {isOpenEditar && (<OperationHorarioModal params={{form, setIsOpen:setIsOpenEditar, setForm, handleSubmit:handleSubmitEditar, cursos, dias}} />)}
        </div>
    );
};

export default HorariosPage;