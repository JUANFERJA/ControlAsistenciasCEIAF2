import React, { useContext, useState } from 'react';
import '../styles/loginPageStyle.scss';
import { generalFunctions } from '../helpers/generalFunctions';
import { AuthContext } from '../auth/context/AuthContext';
import { PathServer } from '../helpers';
import { DataContext } from '../context/DataContext';
import imagenes from '../assets/imagenes';
let routeApi = PathServer().routeApi;

export const LoginPage = () => {

  const{autentica} = generalFunctions();
  const {isAutenticated, setisAutenticated} = useContext(AuthContext);
  const {usuario, setUsuario} = useContext(DataContext);
  const [login, setlogin] = useState({isSuccess:false, data:[]});
  ;

  const handleLogin = (e) =>{
      let url =`Usuario/autentica-usuario`;      
      autentica(setisAutenticated, setUsuario, url, usuario);
     
  }

  
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-visual">
          <div className="brand-badge">
            <span className="brand-icon">CE</span>
            <span>CEIAF N°2</span>
          </div>

          <div className="institution-panel">
            <img src={imagenes.logo} alt="Institución" className="institution-logo" />
          </div>

          <div className="visual-content">
            <span className="eyebrow">Sistema integrado</span>
            <h1>Control de asistencia</h1>
            <p>
              Gestiona entradas, salidas, tardanzas y reportes desde una sola plataforma segura y fácil de usar.
            </p>
          </div>

          <div className="visual-footer">
            <div className="metrics">
              <div className="metric">
                <strong>2.4k</strong>
                <span>Asistencias</span>
              </div>
              <div className="metric">
                <strong>96%</strong>
                <span>Puntualidad</span>
              </div>
            </div>
            <span>24/7</span>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form">
            <h2>Iniciar sesión</h2>
            <p className="subtitle">Bienvenido de nuevo, ingresa tus credenciales.</p>

            <div className="field">
              <label htmlFor="usuario">Usuario</label>
              <input id="usuario" type="text" placeholder="tu usuario" value={usuario.nombre} onChange={(e)=>{setUsuario({...usuario, nombre:e.target.value})}}/>
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" placeholder="••••••••" onChange={(e)=>{setUsuario({...usuario, password:e.target.value})}}  />
            </div>

            <div className="options-row">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="link">¿Olvidaste tu contraseña?</a>
            </div>

            <button className="login-button" onClick={handleLogin}>
              Iniciar sesión
            </button>

            <p className="signup">
              ¿No tienes cuenta? <a href="#">Solicita acceso</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
