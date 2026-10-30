import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/vacacionesPageStyle.scss';
import { generalFunctions } from '../helpers/generalFunctions';


const defaultForm = {
  idDocente: '',
  fechaDesde: '',
  fechaHasta: ''
};

export const VacacionesPage = () => {
  const { docentes = [], vacaciones } = useContext(DataContext) || {};
  const [selectedDocente, setSelectedDocente] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState(defaultForm);
  const { guardarContenido, actualizarContenido, parseLocalDate, formatLocalDate } = generalFunctions();
  
  const years = useMemo(() => {
    const allYears = vacaciones
      .map((item) => new Date(item.fechaDesde).getFullYear())
      .filter((year) => Number.isFinite(year));

    return Array.from(new Set([new Date().getFullYear(), ...allYears])).sort((a, b) => b - a);
  }, [vacaciones]);

  const filteredVacaciones = useMemo(() => {
    return vacaciones.filter((item) => {
      const matchesDocente = selectedDocente === 'all' || Number(item.idDocente) === Number(selectedDocente);
      const itemYear = new Date(item.fechaDesde).getFullYear();
      const matchesYear = selectedYear === 'all' || itemYear === Number(selectedYear);
      return matchesDocente && matchesYear;
    });
  }, [vacaciones, selectedDocente, selectedYear]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (event) => {
    event.preventDefault();

    if (!form.idDocente || !form.fechaDesde || !form.fechaHasta) {
      return;
    }

    const desde = parseLocalDate(form.fechaDesde);
    const hasta = parseLocalDate(form.fechaHasta);

    if (!desde || !hasta || desde > hasta) {
      return;
    }

    const nuevoRegistro = {
      idDocente: Number(form.idDocente),
      fechaDesde: form.fechaDesde,
      fechaHasta: form.fechaHasta
    };
    let urlGuardadContenido = `Vacaciones/crear-vacaciones`;
    console.log(" mis datos", urlGuardadContenido, nuevoRegistro)
    guardarContenido(urlGuardadContenido, nuevoRegistro);
    setForm(defaultForm);
    setIsModalOpen(false);
  };

  const handleEdit = (event) => {
    event.preventDefault();

    if (!editForm.id || !editForm.idDocente || !editForm.fechaDesde || !editForm.fechaHasta) {
      return;
    }

    const desde = parseLocalDate(editForm.fechaDesde);
    const hasta = parseLocalDate(editForm.fechaHasta);

    if (!desde || !hasta || desde > hasta) {
      return;
    }

    const registroActualizado = {
      id: Number(editForm.id),
      idDocente: Number(editForm.idDocente),
      fechaDesde: editForm.fechaDesde,
      fechaHasta: editForm.fechaHasta
    };

    actualizarContenido('Vacaciones/actualizar-vacaciones', registroActualizado);
    setEditForm(defaultForm);
    setIsEditModalOpen(false);
  };

  const openEditModal = (item) => {
    setEditForm({
      id: item.id,
      idDocente: item.idDocente,
      fechaDesde: item.fechaDesde,
      fechaHasta: item.fechaHasta
    });
    setIsEditModalOpen(true);
  };

  const getDocenteNombre = (idDocente) => {
    const docente = docentes.find((item) => Number(item.id) === Number(idDocente));
    return docente ? `${docente.nombre} ${docente.apellido}` : 'Sin docente';
  };

  return (
    <div className="vacaciones-page">
      <div className="vacaciones-header">
        <div>
          <p className="vacaciones-eyebrow">Gestión</p>
          <h1 className="vacaciones-title">Vacaciones</h1>
        </div>

        <button type="button" className="vacaciones-primary-btn" onClick={() => setIsModalOpen(true)}>
          + Nuevo registro
        </button>
      </div>

      <div className="vacaciones-filters-card">
        <div className="vacaciones-field-group">
          <label htmlFor="filtro-docente" className="vacaciones-label">Docente</label>
          <select
            id="filtro-docente"
            value={selectedDocente}
            onChange={(e) => setSelectedDocente(e.target.value)}
            className="vacaciones-select"
          >
            <option value="all">Todos</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.nombre} {docente.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className="vacaciones-field-group">
          <label htmlFor="filtro-anio" className="vacaciones-label">Año</label>
          <select
            id="filtro-anio"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="vacaciones-select"
          >
            <option value="all">Todos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="vacaciones-table-card">
        <table className="vacaciones-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Docente</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Año</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVacaciones.length === 0 ? (
              <tr>
                <td colSpan={6} className="vacaciones-empty-state">
                  No hay registros de vacaciones para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredVacaciones.map((item) => (
                <tr key={item.id} className="vacaciones-tr">
                  <td>{item.id}</td>
                  <td>{getDocenteNombre(item.idDocente)}</td>
                  <td>{formatLocalDate(item.fechaDesde)}</td>
                  <td>{formatLocalDate(item.fechaHasta)}</td>
                  <td>{parseLocalDate(item.fechaDesde)?.getFullYear() || '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="vacaciones-secondary-btn"
                      onClick={() => openEditModal(item)}
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="vacaciones-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="vacaciones-modal" onClick={(event) => event.stopPropagation()}>
            <div className="vacaciones-modal-header">
              <h3 className="vacaciones-modal-title">Nuevo registro de vacaciones</h3>
              <button type="button" className="vacaciones-close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="vacaciones-form">
              <div className="vacaciones-form-grid">
                <label htmlFor="docente-select" className="vacaciones-label-modal">
                  Docente
                  <select
                    id="docente-select"
                    name="idDocente"
                    value={form.idDocente}
                    onChange={handleChange}
                    className="vacaciones-input"
                  >
                    <option value="">Seleccionar docente</option>
                    {docentes.map((docente) => (
                      <option key={docente.id} value={docente.id}>
                        {docente.id} - {docente.nombre} {docente.apellido}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="fecha-desde" className="vacaciones-label-modal">
                  Fecha desde
                  <input
                    id="fecha-desde"
                    type="date"
                    name="fechaDesde"
                    value={form.fechaDesde}
                    onChange={handleChange}
                    className="vacaciones-input"
                  />
                </label>

                <label htmlFor="fecha-hasta" className="vacaciones-label-modal">
                  Fecha hasta
                  <input
                    id="fecha-hasta"
                    type="date"
                    name="fechaHasta"
                    value={form.fechaHasta}
                    onChange={handleChange}
                    className="vacaciones-input"
                  />
                </label>
              </div>

              <div className="vacaciones-actions">
                <button type="button" className="vacaciones-secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="vacaciones-primary-btn">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="vacaciones-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="vacaciones-modal" onClick={(event) => event.stopPropagation()}>
            <div className="vacaciones-modal-header">
              <h3 className="vacaciones-modal-title">Editar vacaciones</h3>
              <button type="button" className="vacaciones-close-btn" onClick={() => setIsEditModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleEdit} className="vacaciones-form">
              <div className="vacaciones-form-grid">
                <label htmlFor="edit-docente-select" className="vacaciones-label-modal">
                  Docente
                  <select
                    id="edit-docente-select"
                    name="idDocente"
                    value={editForm.idDocente}
                    onChange={(event) => setEditForm({ ...editForm, idDocente: event.target.value })}
                    className="vacaciones-input"
                  >
                    <option value="">Seleccionar docente</option>
                    {docentes.map((docente) => (
                      <option key={docente.id} value={docente.id}>
                        {docente.id} - {docente.nombre} {docente.apellido}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="edit-fecha-desde" className="vacaciones-label-modal">
                  Fecha desde
                  <input
                    id="edit-fecha-desde"
                    type="date"
                    value={editForm.fechaDesde}
                    onChange={(event) => setEditForm({ ...editForm, fechaDesde: event.target.value })}
                    className="vacaciones-input"
                  />
                </label>

                <label htmlFor="edit-fecha-hasta" className="vacaciones-label-modal">
                  Fecha hasta
                  <input
                    id="edit-fecha-hasta"
                    type="date"
                    value={editForm.fechaHasta}
                    onChange={(event) => setEditForm({ ...editForm, fechaHasta: event.target.value })}
                    className="vacaciones-input"
                  />
                </label>
              </div>

              <div className="vacaciones-actions">
                <button type="button" className="vacaciones-secondary-btn" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="vacaciones-primary-btn">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

