import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { generalFunctions } from '../helpers/generalFunctions';
import { PathServer } from '../helpers';

const routeApi = PathServer().routeApi;

export const MantenimientoDocentesPage = () => {
  const { docentes, setDocentes, cursos, roles } = useContext(DataContext) || {};
  const { actualizarContenido } = generalFunctions();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    id: '',
    idRol: '',
    IdCurso: '',
    nombre: '',
    apellido: '',
    email: '',
    fechaIngreso: ''
  });

  const docentesList = useMemo(() => Array.isArray(docentes) ? docentes : [], [docentes]);
  const cursosList = useMemo(() => Array.isArray(cursos) ? cursos : [], [cursos]);
  const rolesList = useMemo(() => Array.isArray(roles) ? roles : [], [roles]);

  const abrirModalEdicion = (docente) => {
    const idRol = docente?.idRol ?? docente?.rolId ?? docente?.rol?.id ?? '';
    const idCurso = docente?.IdCurso ?? docente?.idCurso ?? docente?.cursoId ?? docente?.curso?.id ?? '';

    setForm({
      id: docente?.id ?? '',
      idRol: idRol,
      IdCurso: idCurso,
      nombre: docente?.nombre ?? '',
      apellido: docente?.apellido ?? '',
      email: docente?.email ?? '',
      fechaIngreso: docente?.fechaIngreso ?? docente?.fecha_ingreso ?? ''
    });
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const docenteActualizado = {
      id: form.id,
      idRol: Number(form.idRol),
      IdCurso: Number(form.IdCurso),
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      fechaIngreso: form.fechaIngreso
    };

    let url = `Docente/actualizar-docente`;
    actualizarContenido(url, docenteActualizado);

    setDocentes((prev = []) =>
      prev.map((docente) =>
        Number(docente.id) === Number(form.id) ? { ...docente, ...docenteActualizado } : docente
      )
    );

    setIsOpen(false);
  };

  const getCursoNombre = (idCurso) => {
    const curso = cursosList.find((item) => Number(item.id) === Number(idCurso));
    return curso ? curso.nombre : 'Sin curso';
  };

  const getRolNombre = (idRol) => {
    const rol = rolesList.find((item) => Number(item.id) === Number(idRol));
    return rol ? rol.nombre : 'Sin rol';
  };

  return (
    <div style={{ padding: '24px', width: '100vw'}}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>Docentes</h2>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Apellido</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Fecha ingreso</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Curso</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentesList.map((docente) => (
              <tr key={docente.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{docente.id}</td>
                <td style={tdStyle}>{docente.nombre}</td>
                <td style={tdStyle}>{docente.apellido}</td>
                <td style={tdStyle}>{docente.email}</td>
                <td style={tdStyle}>{docente.fechaIngreso || docente.fecha_ingreso || '—'}</td>
                <td style={tdStyle}>{getRolNombre(docente.idRol ?? docente.rolId ?? docente.rol?.id)}</td>
                <td style={tdStyle}>{getCursoNombre(docente.IdCurso ?? docente.idCurso ?? docente.cursoId ?? docente.curso?.id)}</td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    onClick={() => abrirModalEdicion(docente)}
                    style={{
                      border: 'none',
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div style={overlayStyle} onClick={() => setIsOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Editar docente</h3>
              <button type="button" onClick={() => setIsOpen(false)} style={closeButtonStyle}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <label style={labelStyle}>
                  <span>Rol</span>
                  <select name="idRol" value={form.idRol} onChange={handleChange} style={inputStyle}>
                    <option value="">Seleccione un rol</option>
                    {rolesList.map((rol) => (
                      <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                    ))}
                  </select>
                </label>

                <label style={labelStyle}>
                  <span>Curso</span>
                  <select name="IdCurso" value={form.IdCurso} onChange={handleChange} style={inputStyle}>
                    <option value="">Seleccione un curso</option>
                    {cursosList.map((curso) => (
                      <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                    ))}
                  </select>
                </label>

                <label style={labelStyle}>
                  <span>Nombre</span>
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} style={inputStyle} />
                </label>

                <label style={labelStyle}>
                  <span>Apellido</span>
                  <input type="text" name="apellido" value={form.apellido} onChange={handleChange} style={inputStyle} />
                </label>

                <label style={labelStyle}>
                  <span>Fecha ingreso</span>
                  <input type="date" name="fechaIngreso" value={form.fechaIngreso} onChange={handleChange} style={inputStyle} />
                </label>

                <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
                  <span>Email</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsOpen(false)} style={cancelButtonStyle}>Cancelar</button>
                <button type="submit" style={saveButtonStyle}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: '0.8rem',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  background: '#f8fafc'
};

const tdStyle = {
  padding: '14px 16px',
  color: '#0f172a',
  fontSize: '0.95rem'
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.5)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  width: 'min(720px, 92vw)',
  background: '#fff',
  borderRadius: '18px',
  padding: '24px',
  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
  border: '1px solid #e2e8f0'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const closeButtonStyle = {
  border: 'none',
  background: 'transparent',
  fontSize: '2rem',
  cursor: 'pointer',
  color: '#64748b',
  lineHeight: 1
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontWeight: 600,
  color: '#334155',
  fontSize: '0.9rem'
};

const inputStyle = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '10px 12px',
  fontSize: '0.95rem',
  background: '#fff',
  color: '#0f172a'
};

const cancelButtonStyle = {
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  borderRadius: '10px',
  padding: '10px 16px',
  cursor: 'pointer',
  fontWeight: 600
};

const saveButtonStyle = {
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  borderRadius: '10px',
  padding: '10px 16px',
  cursor: 'pointer',
  fontWeight: 700
};
