

import { Route, Routes } from 'react-router-dom';
import React from 'react';
import PrincipalPage from '../pages/PrincipalPage';
import DocentesPage from '../pages/DocentesPage';
import HorariosPage from '../pages/HorariosPage';
import { MantenimientoUsuariosPage } from '../pages/MantenimientoUsuariosPage';
import { MantenimientoCursosPage } from '../pages/MantenimientoCursosPage';
import { MantenimientoDocentesPage } from '../pages/MantenimientoDocentesPage';
import { MantenimientoRegistrosPage } from '../pages/MantenimientoRegistrosPage';
import { VacacionesPage } from '../pages/VacacionesPage';
import { NovedadesPage } from '../pages/NovedadesPage';
import { FeriadosPage } from '../pages/FeriadosPage';

const NotFoundPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Página no encontrada</h2>
  </div>
);

export const Content = () => {
       return (
              <Routes>
                     <Route path='/dashboard' element={<PrincipalPage />} />
                     <Route path='/docentes' element={<DocentesPage />} />
                     <Route path='/horarios' element={<HorariosPage />} />
                     <Route path='/vacaciones' element={<VacacionesPage />} />
                     <Route path='/novedades' element={<NovedadesPage />} />
                     <Route path='/feriados' element={<FeriadosPage />} />
                     <Route path='/mantenimiento-docentes' element={<MantenimientoDocentesPage />} />                     
                     <Route path='/mantenimiento-usuarios' element={<MantenimientoUsuariosPage />} />
                     <Route path='/mantenimiento-cursos' element={<MantenimientoCursosPage />} />
                     <Route path='/mantenimiento-justificativos' element={<MantenimientoRegistrosPage />} />
                     <Route path='*' element={<NotFoundPage />} />
              </Routes>
       );
}


