
import React, { useContext, useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { DataContext } from './DataContext';
import { RefreshContext } from './RefreshContext';
import { PathServer } from '../helpers';

const { routeApi } = PathServer();

export const RefreshProvider = ({ children }) => {

    const {
        setHorarios,
        setRegistroAsistencias,
        setNovedades,
        setVacaciones,
        setFeriados,
        setDocentes
    } = useContext(DataContext);

    const [connection, setConnection] = useState(null);

    useEffect(() => {

        // Crear conexión SignalR
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${routeApi}notificationHub`, {
                withCredentials: true
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
            .configureLogging(LogLevel.Information)
            .build();

        let mounted = true;

        // Escuchar notificaciones
        newConnection.on("ReceiveNotification", (notificationMessage, objeto) => {

            console.log("Notificación recibida:", notificationMessage, objeto);

            if (!notificationMessage) return;

            switch (notificationMessage.toLowerCase()) {

                case 'horarios':
                    setHorarios(objeto);
                    break;

                case 'registros':
                    setRegistroAsistencias(objeto);
                    break;

                case 'novedades':
                    setNovedades(objeto);
                    break;

                case 'vacaciones':
                    setVacaciones(objeto);
                    break;

                case 'feriados':
                    setFeriados(objeto);
                    break;

                case 'docentes':
                    setDocentes(objeto);
                    break;

                default:
                    console.log("Notificación desconocida:", notificationMessage);
            }
        });

        // Eventos de conexión
        newConnection.onreconnecting((error) => {
            console.log("SignalR intentando reconectar...", error);
        });

        newConnection.onreconnected((connectionId) => {
            console.log("SignalR reconectado:", connectionId);
        });

        newConnection.onclose((error) => {
            console.log("Conexión SignalR cerrada:", error);
            if (mounted) {
                setConnection(null);
            }
        });

        // Iniciar conexión
        const startConnection = async () => {

            try {

                await newConnection.start();

                if (mounted) {
                    setConnection(newConnection);
                    console.log("SignalR conectado correctamente");
                }

            } catch (error) {

                console.error("Error al conectar SignalR:", error);

            }
        };

        startConnection();

        // Limpiar conexión
        return () => {

            mounted = false;

            newConnection.stop();

            setConnection(null);
        };

    }, []);

    // Enviar notificaciones
    const sendNotification = async (message) => {

        if (!connection || connection.state !== HubConnectionState.Connected) {
            console.log("No hay conexión SignalR establecida.");
            return;
        }

        try {

            await connection.invoke("SendNotification", message);

        } catch (error) {

            console.error("Error al enviar notificación:", error);

        }
    };

    return (
        <RefreshContext.Provider value={{
            connection,
            setConnection,
            sendNotification
        }}>
            {children}
        </RefreshContext.Provider>
    );
};
