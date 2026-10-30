import React from 'react'
import { generalFunctions } from '../../helpers/generalFunctions';

export const OperationHorarioModal = ({params}) => {
  const {formatTimeSpan} = generalFunctions();
  const {form, setIsOpen, setForm, handleSubmit, cursos, dias} = params;
  console.log("mis parametros", params)
  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Registrar horario</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field full">
                  <label>Curso</label>
                  <select
                    value={form.idCurso}
                    onChange={(e) => setForm({ ...form, idCurso: Number(e.target.value) })}
                  >
                    {cursos.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Día</label>
                  <select
                    value={form.dia}
                    onChange={(e) => setForm({ ...form, dia: Number(e.target.value) })}
                  >
                    {dias.map((dia) => (
                      <option key={dia} value={dia.id}>
                        {dia.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Hora inicio</label>
                  <input
                    type="time"
                    value={form.horaIngreso}
                    onChange={(e) => setForm({ ...form, horaIngreso: formatTimeSpan(e.target.value) })}
                  />
                </div>

                <div className="field">
                  <label>Hora salida</label>
                  <input
                    type="time"
                    value={form.horaSalida}
                    onChange={(e) => setForm({ ...form, horaSalida: formatTimeSpan(e.target.value) })}
                  />
                </div>

                <div className="field">
                  <label>Fecha desde</label>
                  <input
                    type="date"
                    value={form.fechaDesde || ''}
                    onChange={(e) => setForm({ ...form, fechaDesde: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Fecha hasta</label>
                  <input
                    type="date"
                    value={form.fechaHasta || ''}
                    onChange={(e) => setForm({ ...form, fechaHasta: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="primary-btn">
                  Guardar horario
                </button>
              </div>
            </form>
          </div>
        </div>
  )
  
}
