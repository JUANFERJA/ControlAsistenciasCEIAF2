import React, { useContext, useEffect, useState } from 'react'
import { HubConnectionBuilder } from '@microsoft/signalr';
import { DataContext } from './DataContext';
import { RefreshContext } from './RefreshContext';
import { PathServer } from '../helpers';

let routeApi = PathServer().routeApi;

export const RefreshProvider = ({ children }) => {

  const{setHorarios, setRegistroAsistencias, setNovedades, setVacaciones, setFeriados, setDocentes} = useContext(DataContext); 
  const [connection, setConnection] = useState(null);


  // Conexión a SignalR
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${routeApi}notificationHub`, {
        withCredentials: true, // Si usas cookies o autenticación
      })
      .build();

    connection.start()
      .then(() => {
        setConnection(connection); // Guardar la conexión para su uso posterior
      })
      .catch((err) => console.log("Error al conectar", err));

    // Escuchar las notificaciones
    connection.on("ReceiveNotification", (notificationMessage, objeto) => {    

      console.log("notificacion", objeto)
      // para recargar todos los marcos de proceso
      if (notificationMessage.toLowerCase() === 'horarios') {      
       
        setHorarios(objeto)        
        return;
      }      
      if (notificationMessage.toLowerCase() === 'registros') {      
        
        setRegistroAsistencias(objeto)        
        return;
      } 
      if (notificationMessage.toLowerCase() === 'novedades') {      
        
        setNovedades(objeto)        
        return;
      } 
      if (notificationMessage.toLowerCase() === 'vacaciones') {      
        
        setVacaciones(objeto)        
        return;
      } 
      if (notificationMessage.toLowerCase() === 'feriados') {      
        
        setFeriados(objeto)        
        return;
      } 
      if (notificationMessage.toLowerCase() === 'docentes') {      
        
        setDocentes(objeto)        
        return;
      }
    });

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  // Función para enviar una notificación
  const sendNotification = async (message) => {
    if (connection) {
      await connection.invoke("SendNotification", message); // Asegúrate de invocar el método del Hub correctamente
    } else {
      console.log("No hay conexión establecida.");
    }
  };


  return (
    <RefreshContext.Provider value={{connection, setConnection}}>
      {children}
    </RefreshContext.Provider>
  )
}
