import React, { useState } from 'react'
import { DataContext } from './DataContext'

export const DataProvider = ({children}) => {

    const [docentes, setDocentes] = useState([]);
    const [vacaciones, setVacaciones] = useState([]);
    const [novedades, setNovedades] = useState([]);
    const [feriados, setFeriados] = useState([]);
    const [registroAsistencias, setRegistroAsistencias] = useState([]);
    const [menus, setMenus] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [usuario, setUsuario] = useState({nombre: '', password: '', apellido:'', idRol:1})

    const mesDefault = new Date().getMonth() + 1;

  return (
    <DataContext.Provider   value={{docentes, setDocentes,
                                    vacaciones, setVacaciones,
                                    novedades, setNovedades,
                                    feriados, setFeriados,
                                    registroAsistencias, setRegistroAsistencias,
                                    menus, setMenus,
                                    horarios, setHorarios,
                                    cursos, setCursos,
                                    roles, setRoles,
                                    usuario, setUsuario,
                                    mesDefault
                                   }}>
        {children}
    </DataContext.Provider>
  )
}
