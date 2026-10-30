import React, { useContext, useEffect, useMemo, useState } from 'react';
import '../styles/modificarRegistroAsistencias.scss';
import { DataContext } from '../context/DataContext';
import { generalFunctions } from '../helpers/generalFunctions';
import { dateData } from '../data/dateData';

const defaultForm = {
  idDocente: '',
  fecha: '',
  horaIngreso: '',
  horaSalida: '',
  descripcion: '',
  idEstado:0,
  detalle: '',
  clase:''
};

export const MantenimientoRegistrosPage = () => {

    const {registroAsistencias, docentes, mesDefault, setRegistroAsistencias} = useContext(DataContext);
    const {meses} = dateData();
    const [selectedDocenteId, setSelectedDocenteId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(mesDefault);
    const {actualizarContenido, formatTimeSpan} = generalFunctions();
    const [form, setForm] = useState(defaultForm);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      if (!selectedDocenteId && Array.isArray(docentes) && docentes.length > 0) {
        setSelectedDocenteId(String(docentes[0].id));
      }
    }, [docentes, selectedDocenteId]);

    const dataFiltrada = useMemo(() => {
      const docenteId = Number(selectedDocenteId);
      if (!docenteId) return [];

      return (registroAsistencias || []).filter((r) => {
        const fecha = String(r.fecha || '').split('T')[0];
        const month = Number(fecha.split('-')[1] || 0);
        return Number(r.idDocente) === docenteId && month === Number(selectedMonth);
      });
    }, [registroAsistencias, selectedDocenteId, selectedMonth]);

    const abrirModalEdicion = (registro) => {
      const fecha = String(registro.fecha || '').split('T')[0];
      const baseForm = {
        id: registro.id || '',
        idDocente: registro.idDocente || '',
        fecha,
        horaIngreso: registro.horaIngreso || '',
        horaSalida: registro.horaSalida || '',
        descripcion: registro.descripcion || '',
        idEstado: 1,       
        clase: registro.clase || ''
      };

      setForm(baseForm);
      setIsOpen(true);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const registroActualizado = {
        id: form.id,
        idDocente: Number(form.idDocente),
        fecha: form.fecha,
        horaIngreso: form.horaIngreso,
        horaSalida: form.horaSalida,        
        idEstado: Number(form.idEstado),
        detalle: form.descripcion,
        clase: 'normal'
      };

      const url = `RegistroAsistencia/actualizar-registro-asistencia`;
      actualizarContenido(url, registroActualizado);

      setRegistroAsistencias((prev = []) =>
        prev.map((registro) =>
          Number(registro.id) === Number(form.id) ? { ...registro, ...registroActualizado } : registro
        )
      );

      setIsOpen(false);
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const getEstadoLabel = (idEstado) => {
      const estadoMap = {
        1: 'Asistencia',
        2: 'Atraso',
        3: 'Falta',
        4: 'Extra'
      };

      return estadoMap[idEstado] || 'Sin estado';
    };
  return (
    <div className="registros-page">
      <div className="registros-header">
        <h2>Mantenimiento de registros</h2>
      </div>

      <div className="registros-card">
        <div className="registros-controls">
          <label className="form-field">
            <span>Docente</span>
            <select
              value={selectedDocenteId}
              onChange={(e) => setSelectedDocenteId(e.target.value)}
              className="form-select"
            >
              {Array.isArray(docentes) && docentes.map((docente) => (
                <option key={docente.id} value={docente.id}>{docente.nombre} {docente.apellido}</option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Mes</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="form-select"
            >
              {meses.map((mes) => (
                <option key={mes.idMes || mes.id} value={mes.id}>{mes.descripcion}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="registros-table-wrapper">
          <table className="registros-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora ingreso</th>
                <th>Hora salida</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltrada.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">No hay registros para este docente y mes.</td>
                </tr>
              ) : (
                dataFiltrada.map((r) => (
                  <tr key={`${r.id || r.fecha}-${r.idDocente}`}>
                    <td>{String(r.fecha || '').split('T')[0]}</td>
                    <td>{r.horaIngreso || '--:--'}</td>
                    <td>{r.horaSalida || '--:--'}</td>
                    <td>
                      <span className={`estado-pill ${r.clase || 'sin-registro'}`}>
                        {r.detalle || getEstadoLabel(r.idEstado)}
                      </span>
                    </td>
                    <td>{r.descripcion || 'Sin descripción'}</td>
                    <td>
                      <button type="button" onClick={() => abrirModalEdicion(r)} className="primary-btn small-btn">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar registro</h3>
              <button type="button" className="close-btn" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-grid">
                <label className="field-label">
                  <span>Fecha</span>
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className="form-select"
                  />
                </label>

                <label className="field-label">
                  <span>Estado</span>
                  <select
                    name="idEstado"
                    value={form.idEstado}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value={1}>Asistencia</option>
                    <option value={2}>Atraso</option>
                    <option value={3}>Falta</option>
                    <option value={4}>Extra</option>
                  </select>
                </label>

                <label className="field-label">
                  <span>Hora ingreso</span>
                  <input
                    type="time"
                    step="1"
                    name="horaIngreso"
                    value={form.horaIngreso || '08:00:00'}
                    onChange={(e) => setForm({ ...form, horaIngreso: formatTimeSpan(e.target.value) })}
                    className="form-select"
                  />
                </label>

                <label className="field-label">
                  <span>Hora salida</span>
                  <input
                    type="time"
                    step="1"
                    name="horaSalida"
                    value={form.horaSalida || '17:00:00'}
                    onChange={(e) => setForm({ ...form, horaSalida: formatTimeSpan(e.target.value) })}
                    className="form-select"
                  />
                </label>

                <label className="field-label" style={{ gridColumn: '1 / -1' }}>
                  <span>Descripción</span>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="form-select"
                    rows={3}
                    style={{ width: '100%', minHeight: '90px', resize: 'vertical' }}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MantenimientoRegistrosPage;
