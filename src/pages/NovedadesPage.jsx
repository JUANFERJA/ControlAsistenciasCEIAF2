import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/novedadesPageStyle.scss';
import { generalFunctions } from '../helpers/generalFunctions';

const defaultForm = {
  idDocente: '',
  fecha: '',
  horaDesde: '',
  horaHasta: '',
  descripcion: ''
};

export const NovedadesPage = () => {
  const { docentes = [], novedades = [], setNovedades } = useContext(DataContext) || {};
  const [selectedDocente, setSelectedDocente] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const { guardarContenido, formatTimeSpan, parseLocalDate, formatLocalDate, alertError } = generalFunctions();

  const filteredNovedades = useMemo(() => {
    return novedades.filter((item) => {
      const matchesDocente = selectedDocente === 'all' || Number(item.idDocente) === Number(selectedDocente);
      return matchesDocente;
    });
  }, [novedades, selectedDocente]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (event) => {
    event.preventDefault();

    if (!form.idDocente || !form.fecha || !form.horaDesde || !form.horaHasta || !form.descripcion.trim()) {
      alertError("debes llenar todos los campos")
      return;
    }

    if (form.horaHasta < form.horaDesde) {
        alertError("la hora de entrada no puede ser mayor a la hora de salida")
      return;
    }

    const nuevoRegistro = {     
      idDocente: Number(form.idDocente),
      fecha: form.fecha,
      horaDesde: formatTimeSpan(form.horaDesde),
      horaHasta: formatTimeSpan(form.horaHasta),
      descripcion: form.descripcion.trim()
    };

    let urlguardarNovedad = 'Novedades/crear-novedades';
    setNovedades((prev = []) => [nuevoRegistro, ...prev]);
    guardarContenido(urlguardarNovedad, nuevoRegistro);
    setForm(defaultForm);
    setIsModalOpen(false);
  };

  const getDocenteNombre = (idDocente) => {
    const docente = docentes.find((item) => Number(item.id) === Number(idDocente));
    return docente ? `${docente.nombre} ${docente.apellido}` : 'Sin docente';
  };

  return (
    <div className="novedades-page">
      <div className="novedades-header">
        <div>
          <p className="novedades-eyebrow">Gestión</p>
          <h1 className="novedades-title">Novedades</h1>
        </div>

        <button type="button" className="novedades-primary-btn" onClick={() => setIsModalOpen(true)}>
          + Nuevo registro
        </button>
      </div>

      <div className="novedades-filters-card">
        <div className="novedades-field-group">
          <label htmlFor="filtro-docente" className="novedades-label">Docente</label>
          <select
            id="filtro-docente"
            value={selectedDocente}
            onChange={(e) => setSelectedDocente(e.target.value)}
            className="novedades-select"
          >
            <option value="all">Todos</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.nombre} {docente.apellido}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="novedades-table-card">
        <table className="novedades-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Docente</th>
              <th>Fecha</th>
              <th>Hora desde</th>
              <th>Hora hasta</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {filteredNovedades.length === 0 ? (
              <tr>
                <td colSpan={6} className="novedades-empty-state">
                  No hay registros de novedades para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredNovedades.map((item) => (
                <tr key={item.id} className="novedades-tr">
                  <td>{item.id}</td>
                  <td>{getDocenteNombre(item.idDocente)}</td>
                  <td>{formatLocalDate(item.fecha)}</td>
                  <td>{item.horaDesde}</td>
                  <td>{item.horaHasta}</td>
                  <td>{item.descripcion || 'Sin descripción'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="novedades-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="novedades-modal" onClick={(event) => event.stopPropagation()}>
            <div className="novedades-modal-header">
              <h3 className="novedades-modal-title">Nuevo registro de novedades</h3>
              <button type="button" className="novedades-close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="novedades-form">
              <div className="novedades-form-grid">
                <label htmlFor="docente-select" className="novedades-label-modal">
                  Docente
                  <select
                    id="docente-select"
                    name="idDocente"
                    value={form.idDocente}
                    onChange={handleChange}
                    className="novedades-input"
                  >
                    <option value="">Seleccionar docente</option>
                    {docentes.map((docente) => (
                      <option key={docente.id} value={docente.id}>
                        {docente.id} - {docente.nombre} {docente.apellido}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="novedad-fecha" className="novedades-label-modal">
                  Fecha
                  <input
                    id="novedad-fecha"
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className="novedades-input"
                  />
                </label>

                <label htmlFor="hora-desde" className="novedades-label-modal">
                  Hora desde
                  <input
                    id="hora-desde"
                    type="time"
                    name="horaDesde"
                    value={form.horaDesde}
                    onChange={handleChange}
                    className="novedades-input"
                  />
                </label>

                <label htmlFor="hora-hasta" className="novedades-label-modal">
                  Hora hasta
                  <input
                    id="hora-hasta"
                    type="time"
                    name="horaHasta"
                    value={form.horaHasta}
                    onChange={handleChange}
                    className="novedades-input"
                  />
                </label>

                <label htmlFor="descripcion" className="novedades-label-modal" style={{ gridColumn: '1 / -1' }}>
                  Descripción
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="novedades-input novedades-textarea"
                    rows={3}
                    placeholder="Ingrese una descripción de la novedad"
                  />
                </label>
              </div>

              <div className="novedades-actions">
                <button type="button" className="novedades-secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="novedades-primary-btn">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

