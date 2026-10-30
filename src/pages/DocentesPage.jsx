import React, { useContext, useEffect, useMemo, useState } from 'react';
import '../styles/docentesPage.scss';
import { DataContext } from '../context/DataContext';
import { dateData } from '../data/dateData';
import { ReporteAsistenciaByDocenteModal } from '../components/Modales/ReporteAsistenciaByDocenteModal';
import { reporteDocenteFunctions } from '../helpers/reporteDocenteFunctions';



const DocentesPage = () => {
    const { exportarResumen, exportHtmlTableFromRows } = reporteDocenteFunctions();
    const { meses, headers } = dateData();
    const { docentes, registroAsistencias, horarios, cursos, mesDefault, vacaciones = [], feriados = [], novedades = [] } = useContext(DataContext);
    const mesNombre = meses.find((m) => Number(m.id) === Number(mesDefault))?.descripcion || 'mes';
    const [mes, setMes] = useState({ idMes: mesDefault ?? 1, descripcion:mesNombre });   
    const [showModal, setShowModal] = useState(false);
    const [docenteInfo, setDocenteInfo] = useState();

    let dataFiltrada = registroAsistencias.filter(r => parseInt(r.fecha.split("-")[1], 10) == mes.idMes)
 
    let faltas = dataFiltrada.filter(d => Number(d.idEstado) === 3).length;
    let atrasos = dataFiltrada.filter(d => Number(d.idEstado) === 2).length;
  
    const openModal = (docente) =>{
        setDocenteInfo(docente);
        setShowModal(true)
    }

    const exportarNovedades = () => {
        

        
        
        const rowsBase = (Array.isArray(registroAsistencias) ? registroAsistencias : [])
            .filter((item) => {
                const fecha = String(item?.fecha || '').split('T')[0];
                const mesFecha = Number(fecha.split('-')[1] || 0);
                const estado = Number(item?.idEstado);
                return [2, 3, 4].includes(estado) && mesFecha === Number(mes.idMes);
            })
            .map((item) => {
                const docente = (Array.isArray(docentes) ? docentes : []).find(
                    (d) => Number(d.id) === Number(item.idDocente)
                );

                return {
                    docente: `${docente?.nombre || ''} ${docente?.apellido || ''}`.trim(),
                    fecha: String(item?.fecha || '').split('T')[0],
                    horaDesde: item?.horaIngreso || '--:--',
                    horaHasta: item?.horaSalida || '--:--',
                    descripcion: item?.detalle || 'Sin descripción',
                    clase: item?.clase || 'normal',
                    idDocente: Number(item?.idDocente || 0)
                };
            })
            .sort((a, b) => {
                if (a.docente.localeCompare(b.docente) !== 0) {
                    return a.docente.localeCompare(b.docente);
                }
                return new Date(a.fecha) - new Date(b.fecha);
            });

        const rows = [];
        let lastDocente = null;

        rowsBase.forEach((item) => {
            if (lastDocente && lastDocente !== item.docente) {
                rows.push([{ type: 'separator' }]);
            }

            const classColors = {
                extraordinaria: { bgcolor: '#dcfce7', textColor: '#166534' },                
                atraso: { bgcolor: '#fef3c7', textColor: '#92400e' },
                falta: { bgcolor: '#fee2e2', textColor: '#991b1b' },
                feriado: { bgcolor: '#f8fafc', textColor: '#192a0f' }
            };

            const color = classColors[item.clase] || classColors.default;

            rows.push([
                { value: item.docente, ...color },
                { value: item.fecha, ...color },
                { value: item.horaDesde, ...color },
                { value: item.horaHasta, ...color },
                { value: item.descripcion, ...color }
            ]);

            lastDocente = item.docente;
        });

        exportHtmlTableFromRows(
            `novedades_${mesNombre.toLowerCase()}.xls`,
            `Novedades de docentes - ${mesNombre}`,
            headers,
            rows
        );
    };

    return (
        <div className="docentes-page">

            <div className="page-shell">
                <header className="page-header">
                    <div>
                        <h1 className="page-title">Docentes</h1>
                        <p className="page-subtitle">Reporte de asistencia y control de inasistencias</p>
                    </div>

                    <div className="header-actions">
                        <button className="export-btn secondary" onClick={() => exportarResumen(mes.descripcion)}>
                            Descargar resumen
                        </button>
                        <button className="export-btn" onClick={exportarNovedades}>
                            Descargar novedades
                        </button>
                    </div>
                </header>

                <section className="summary-grid">
                    <div className="summary-card blue">
                        <span className="summary-label">Total docentes</span>
                        <span className="summary-value">{Array.isArray(docentes) ? docentes.length : 0}</span>
                    </div>

                    <div className="summary-card yellow">
                        <span className="summary-label">Total atrasos</span>
                        <span className="summary-value">{atrasos}</span>
                    </div>

                    <div className="summary-card red">
                        <span className="summary-label">Total faltas</span>
                        <span className="summary-value">{faltas}</span>
                    </div>
                </section>

                <section className="table-card" id = "reporte">
                    <div className="table-header">
                        <h3>Listado de docentes</h3>
                        <select className="month-select" value={mes.idMes} onChange={(e) => setMes({ idMes: Number(e.target.value), descripcion: e.target.selectedOptions[0]?.text || '' })}>
                            {meses.map((mesItem) => (
                                <option key={mesItem.id} value={mesItem.id}>
                                    {mesItem.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del docente</th>
                                <th>Mes</th>
                                <th>Total faltas</th>
                                <th>Total atrasos</th>
                                <th>extras</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docentes.map((item) => (
                                <tr key={item.id}>
                                    <td className="teacher-name">{`${item.nombre} ${item.apellido}`}</td>
                                    <td>{meses.find((m) => Number(m.id) === Number(mes.idMes))?.descripcion || ''}</td>
                                    <td>
                                        <span className="count-pill faltas">{dataFiltrada.filter(d => Number(d.idDocente) === Number(item.id) && Number(d.idEstado) === 3).length}</span>
                                    </td>
                                    <td>
                                        <span className="count-pill atrasos">{dataFiltrada.filter(d => Number(d.idDocente) === Number(item.id) && Number(d.idEstado) === 2).length}</span>
                                    </td>
                                    <td>
                                        <span className="count-pill extras">{dataFiltrada.filter(d => Number(d.idDocente) === Number(item.id) && Number(d.idEstado) === 4).length}</span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button className="action-btn primary" 
                                                    onClick={() => openModal({ "data": dataFiltrada.filter(d => Number(d.idDocente) === Number(item.id)), docente: item, mes })}>
                                                Revisar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {showModal && (
                <ReporteAsistenciaByDocenteModal params={docenteInfo} closeModal={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default DocentesPage;