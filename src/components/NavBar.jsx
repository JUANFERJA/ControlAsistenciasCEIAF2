import React, { useContext } from 'react'
import { DataContext } from '../context/DataContext'

export const NavBar = ({ onToggleSidebar }) => {
  const {usuario, roles} = useContext(DataContext);
  console.log("mi usuario", usuario, roles)
  const {nombre, apellido, idRol} = usuario;
  let rol = roles.find(r => r.id == idRol);
  
  
  return (
     <nav className="topbar">
        <div className="brand-wrap">
          <button
            type="button"
            className="nav-hamburger"
            aria-label="Abrir menú"
            onClick={onToggleSidebar}
          >
            ☰
          </button>

          <div className="brand">
            <div className="brand-mark">A</div>
            <div>
              <h2>Asistencia Pro</h2>
              <span>Control de personal</span>
            </div>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="search-box">Buscar empleados...</div>
          <div className="icon-group">
            <button className="icon-btn" aria-label="Notificaciones">🔔</button>
            <button className="icon-btn" aria-label="Mensajes">✉️</button>
            <div className="profile-pill">
              <div className="avatar">{`${nombre.charAt(0)}${apellido.charAt(0)}`}</div>
              <div className="profile-info">
                <strong>{`${nombre} ${apellido}`}</strong>
                {roles.length > 0 && <span>{`${rol.nombre}`}</span>}
              </div>
            </div>
          </div>
        </div>
      </nav>

  )
}
