import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/feriadosPageStyle.scss';
import { generalFunctions } from '../helpers/generalFunctions';

const defaultForm = {
  fecha: '',
  descripcion: ''
};

export const FeriadosPage = () => {
  const { feriados = [], setFeriados } = useContext(DataContext) || {};
  const [selectedYear, setSelectedYear] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const { guardarContenido, parseLocalDate, formatLocalDate } = generalFunctions();

  const years = useMemo(() => {
    const allYears = feriados
      .map((item) => parseLocalDate(item.fecha)?.getFullYear())
      .filter((year) => Number.isFinite(year));

    return Array.from(new Set([new Date().getFullYear(), ...allYears])).sort((a, b) => b - a);
  }, [feriados]);

  const filteredFeriados = useMemo(() => {
    return feriados.filter((item) => {
      const itemYear = parseLocalDate(item.fecha)?.getFullYear();
      return selectedYear === 'all' || itemYear === Number(selectedYear);
    });
  }, [feriados, selectedYear]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (event) => {
    event.preventDefault();

    if (!form.fecha || !form.descripcion.trim()) {
      return;
    }

    const nuevoRegistro = {      
      fecha: form.fecha,
      descripcion: form.descripcion.trim()
    };
    let urlCreateFeriado = 'Feriados/crear-feriados'
    
    guardarContenido(urlCreateFeriado, nuevoRegistro);
    setForm(defaultForm);
    setIsModalOpen(false);
  };

  return (
    <div className="feriados-page">
      <div className="feriados-header">
        <div>
          <p className="feriados-eyebrow">Gestión</p>
          <h1 className="feriados-title">Feriados</h1>
        </div>

        <button type="button" className="feriados-primary-btn" onClick={() => setIsModalOpen(true)}>
          + Nuevo registro
        </button>
      </div>

      <div className="feriados-filters-card">
        <div className="feriados-field-group">
          <label htmlFor="filtro-anio" className="feriados-label">Año</label>
          <select
            id="filtro-anio"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="feriados-select"
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

      <div className="feriados-table-card">
        <table className="feriados-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeriados.length === 0 ? (
              <tr>
                <td colSpan={3} className="feriados-empty-state">
                  No hay registros de feriados para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredFeriados.map((item) => (
                <tr key={item.id} className="feriados-tr">
                  <td>{item.id}</td>
                  <td>{formatLocalDate(item.fecha)}</td>
                  <td>{item.descripcion || 'Sin descripción'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="feriados-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="feriados-modal" onClick={(event) => event.stopPropagation()}>
            <div className="feriados-modal-header">
              <h3 className="feriados-modal-title">Nuevo registro de feriado</h3>
              <button type="button" className="feriados-close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="feriados-form">
              <div className="feriados-form-grid">
                <label htmlFor="feriado-fecha" className="feriados-label-modal">
                  Fecha
                  <input
                    id="feriado-fecha"
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className="feriados-input"
                  />
                </label>

                <label htmlFor="feriado-descripcion" className="feriados-label-modal">
                  Descripción
                  <textarea
                    id="feriado-descripcion"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="feriados-textarea"
                    rows={4}
                    placeholder="Ingrese la descripción del feriado"
                  />
                </label>
              </div>

              <div className="feriados-actions">
                <button type="button" className="feriados-secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="feriados-primary-btn">
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
