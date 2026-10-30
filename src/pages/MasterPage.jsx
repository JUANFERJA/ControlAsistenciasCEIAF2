import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../auth/context/AuthContext'
import { Content } from '../components/Content'
import { LoginPage } from './LoginPage'
import { DataContext } from '../context/DataContext'
import { generalFunctions } from '../helpers/generalFunctions'
import { NavBar } from '../components/NavBar';
import { Sidebar } from '../components/Sidebar';


export const MasterPage = () => {
    const { generarContenido } = generalFunctions();
    const { setDocentes, setRegistroAsistencias, setHorarios, setCursos, setRoles, setVacaciones, setNovedades, setFeriados } = useContext(DataContext);
    const { isAutenticated } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   
    let autenticated = localStorage.getItem("isAutenticated");
    useEffect(() => {

        let urlDocentes = `Docente/obtener-docentes`;
        let urlRegistroAsistencias = `RegistroAsistencia/obtener-registro-asistencias`;       
        let urlHorarios = `Horario/obtener-horarios`;
        let urlCursos = `Curso/obtener-cursos`;
        let urlRoles = `Roles/obtener-roles`;
        let urlVacaciones = 'Vacaciones/obtener-vacaciones'
        let urlNovedades = 'Novedades/obtener-novedades';
        let urlFeriados = 'Feriados/obtener-feriados';
        generarContenido(setDocentes, urlDocentes);
        generarContenido(setRegistroAsistencias, urlRegistroAsistencias);
        generarContenido(setHorarios, urlHorarios);
        generarContenido(setCursos, urlCursos);
        generarContenido(setRoles, urlRoles);
        generarContenido(setVacaciones, urlVacaciones)
        generarContenido(setNovedades, urlNovedades);
        generarContenido(setFeriados, urlFeriados);
    }, [])

    return (
        <>
            {
                isAutenticated || autenticated == true ? (
                    <div className="attendance-app">
                        <NavBar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
                        <div className="layout">
                            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                            <Content></Content>
                        </div>
                    </div>) : (<LoginPage></LoginPage>)
            }
        </>
    )
}
