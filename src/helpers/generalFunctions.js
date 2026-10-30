import React from 'react'
import { helpHttp } from './helpHttp';
import Swal from 'sweetalert2';
import { PathServer } from './path';

let api = helpHttp();
const routeApi = PathServer().routeApi;

export const generalFunctions = () => {

    const autentica = (setAutenticated, setUsuario, url, datos) => {
       
        let options = { headers: { "content-type": "application/json" }, body: datos };
        api.post(`${routeApi}${url}`, options).then((res) => {

            if (res.isSuccess) {                
                setAutenticated(res.isSuccess);
                setUsuario(res.data);
                localStorage.setItem("isAutenticated", true);
                localStorage.setItem("usuario", JSON.stringify(res.data));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message,
                })
            }
        });
    }

    const generarContenido = (setValue, url) => {
        let options = { headers: { "content-type": "application/json" } };
        api.get(`${routeApi}${url}`, options).then((res) => {
            if (res.isSuccess) {
                setValue(res.data)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message,
                })
            }
        });
    }

    const guardarContenido = (url, datos) => {

        let options = { headers: { "content-type": "application/json" }, body: datos };
        console.log(options, datos)
        api.post(`${routeApi}${url}`, options).then((res) => {

            if (res.isSuccess) {
                console.log(res)
            } else {
                alertError(res.message);
            }
        });
    }
    const actualizarContenido = (url, datos) => {

        let options = { headers: { "content-type": "application/json" }, body: datos };
        console.log(options, datos)
        api.put(`${routeApi}${url}`, options).then((res) => {

            if (res.isSuccess) {
                console.log(res)
            } else {
                alertError(res.message);
            }
        });
    }

    const alertError = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
        })
    }
    const formatTimeSpan = (value) => {
        if (!value) return '00:00:00';

        const clean = String(value).replace(/[^0-9:]/g, '').trim();
        const parts = clean.split(':').filter(Boolean);

        if (parts.length === 0) return '00:00:00';

        const horas = String(parts[0] || '00').padStart(2, '0');
        const minutos = String(parts[1] || '00').padStart(2, '0');
        
        return `${horas}:${minutos}:59`;
    };

    const parseLocalDate = (value) => {
        if (!value) return null;

        const [year, month, day] = String(value).split(/[-T]/).slice(0, 3).map(Number);
        if (!year || !month || !day) return null;

        return new Date(year, month - 1, day, 12, 0, 0);
    };

    const formatLocalDate = (value) => {
        const parsed = parseLocalDate(value);
        if (!parsed || Number.isNaN(parsed.getTime())) return '—';

        return parsed.toLocaleDateString('es-AR');
    };

    return {
        generarContenido,
        autentica,
        guardarContenido,
        actualizarContenido,
        alertError,
        formatTimeSpan,
        parseLocalDate,
        formatLocalDate
    }
}
