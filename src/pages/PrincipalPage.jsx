import React, { useContext, useRef, useState } from 'react';
import '../styles/principalPageStyle.scss';
import { DataContext } from '../context/DataContext';
import Swal from 'sweetalert2';
import { PathServer } from '../helpers';
import { dateData } from '../data/dateData';



const getMonthFromValue = (value) => {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.getMonth() + 1;
};

const PrincipalPage = () => {

    const { docentes = [], registroAsistencias = [], mesDefault, novedades = [], feriados = [] } = useContext(DataContext);
    const { meses } = dateData();
    const fileInputRef = useRef(null);
    const [selectedMonth, setSelectedMonth] = useState(Number(mesDefault || new Date().getMonth() + 1));
    const [selectedCard, setSelectedCard] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const routeApi = PathServer().routeApi;

    const mesActual = Number(selectedMonth || new Date().getMonth() + 1);
    const dataFiltrada = registroAsistencias.filter((r) => Number(getMonthFromValue(r?.fecha)) === mesActual);
    const faltasMes = dataFiltrada.filter((d) => Number(d.idEstado) === 3).length;
    const atrasosMes = dataFiltrada.filter((d) => Number(d.idEstado) === 2).length;
    const presentesMes = dataFiltrada.filter((d) => Number(d.idEstado) === 4).length;
    const novedadesMes = novedades.filter((n) => Number(getMonthFromValue(n?.fecha)) === mesActual).length;
    const feriadosMes = feriados.filter((f) => Number(getMonthFromValue(f?.fecha)) === mesActual).length;

    const getDocenteNombre = (idDocente) => {
        const docente = (Array.isArray(docentes) ? docentes : []).find((item) => Number(item.id) === Number(idDocente));
        if (!docente) return `Docente ${idDocente ?? ''}`;
        return `${docente.nombre || ''} ${docente.apellido || ''}`.trim();
    };

    const getEstadoLabel = (idEstado) => {
        const labels = {
            1: 'Presente',
            2: 'Atraso',
            3: 'Falta',
            4: 'Asistencia extraordinaria'
        };

        return labels[Number(idEstado)] || 'Sin estado';
    };

    const statsCards = [
        { key: 'docentes-activos', label: 'Docentes activos', value: docentes.length, icon: '✅', tone: 'green', detail: 'Registrados en el sistema' },
        { key: 'faltas', label: 'Faltas', value: faltasMes, icon: '❌', tone: 'red', detail: 'Requieren revisión' },
        { key: 'atrasos', label: 'Atrasos', value: atrasosMes, icon: '⏰', tone: 'orange', detail: 'Con demora' },
        { key: 'novedades', label: 'Novedades', value: novedadesMes, icon: '📝', tone: 'green', detail: 'Este mes' },
        { key: 'feriados', label: 'Feriados', value: feriadosMes, icon: '🏖️', tone: 'blue', detail: 'Calendario vigente' },
        { key: 'presentes', label: 'Asistencia extraordinaria', value: presentesMes, icon: '⭐', tone: 'blue', detail: 'Horas extras' },
    ];

    const selectedCardRows = (() => {
        if (!selectedCard) return [];

        switch (selectedCard.key) {
            case 'docentes-activos':
                return (Array.isArray(docentes) ? docentes : []).map((docente) => ({
                    fecha: '-',
                    docente: `${docente.nombre || ''} ${docente.apellido || ''}`.trim(),
                    detalle: docente.email || 'Sin email registrado',
                    tipo: 'Docente activo'
                }));
            case 'presentes':
                return dataFiltrada.filter((registro) => Number(registro.idEstado) === 4).map((registro) => ({
                    fecha: registro.fecha || '-',
                    docente: getDocenteNombre(registro.idDocente),
                    detalle: getEstadoLabel(registro.idEstado),
                    tipo: 'Asistencia extraordinaria'
                }));
            case 'faltas':
                return dataFiltrada.filter((registro) => Number(registro.idEstado) === 3).map((registro) => ({
                    fecha: registro.fecha || '-',
                    docente: getDocenteNombre(registro.idDocente),
                    detalle: getEstadoLabel(registro.idEstado),
                    tipo: 'Asistencia'
                }));
            case 'atrasos':
                return dataFiltrada.filter((registro) => Number(registro.idEstado) === 2).map((registro) => ({
                    fecha: registro.fecha || '-',
                    docente: getDocenteNombre(registro.idDocente),
                    detalle: getEstadoLabel(registro.idEstado),
                    tipo: 'Asistencia'
                }));
            case 'novedades':
                return (Array.isArray(novedades) ? novedades : []).filter((novedad) => Number(getMonthFromValue(novedad?.fecha)) === mesActual).map((novedad) => ({
                    fecha: novedad.fecha || '-',
                    docente: getDocenteNombre(novedad.idDocente),
                    detalle: novedad.descripcion || 'Sin descripción',
                    tipo: 'Novedad'
                }));
            case 'feriados':
                return (Array.isArray(feriados) ? feriados : []).filter((feriado) => Number(getMonthFromValue(feriado?.fecha)) === mesActual).map((feriado) => ({
                    fecha: feriado.fecha || '-',
                    docente: '-',
                    detalle: feriado.descripcion || 'Sin descripción',
                    tipo: 'Feriado'
                }));
            default:
                return [];
        }
    })();

    const teacherSummary = (Array.isArray(docentes) ? docentes : []).map((docente) => {
        const docenteRecords = (Array.isArray(registroAsistencias) ? registroAsistencias : []).filter(
            (registro) => Number(registro.idDocente) === Number(docente.id)
        );

        const faltasMesDocente = docenteRecords.filter((registro) => Number(getMonthFromValue(registro?.fecha)) === mesActual && Number(registro.idEstado) === 3).length;
        const atrasosMesDocente = docenteRecords.filter((registro) => Number(getMonthFromValue(registro?.fecha)) === mesActual && Number(registro.idEstado) === 2).length;
        const justificacionesDocente = (Array.isArray(novedades) ? novedades : []).filter(
            (novedad) => Number(novedad.idDocente) === Number(docente.id)
                && /justif|justific/i.test(String(novedad.descripcion || ''))
        ).length;

        return {
            nombre: `${docente.nombre || ''} ${docente.apellido || ''}`.trim(),
            faltas: faltasMesDocente,
            justificaciones: justificacionesDocente,
            atrasos: atrasosMesDocente,
            feriados: feriadosMes
        };
    });

    const handleOpenFileDialog = () => fileInputRef.current?.click();

    const handleExcelUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        const allowed = ['xls', 'xlsx', 'csv'];

        if (!allowed.includes(extension)) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo no válido',
                text: 'Solo puedes cargar archivos Excel o CSV.'
            });
            event.target.value = '';
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${routeApi}RegistroAsistencia/cargar-registros-asistencia`, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            const text = await response.text();
            let result = {};

            try {
                result = text ? JSON.parse(text) : {};
            } catch (error) {
                result = { message: text || 'Archivo cargado correctamente.' };
            }

            if (!response.ok) {
                throw new Error(result.message || 'No se pudo cargar el archivo de asistencia.');
            }

            Swal.fire({
                icon: 'success',
                title: 'Archivo cargado',
                text: result.message || 'La asistencia se cargó correctamente.'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar Excel',
                text: error.message || 'Ocurrió un problema al enviar el archivo.'
            });
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    return (

        <>

            {isUploading ? (
                <main className="content loading-content">
                    <div className="loading-state" aria-live="polite" aria-busy="true">
                        <div className="spinner" />
                        <h2>Cargando archivo de asistencia</h2>
                        <p>Procesando el excel y validando los registros...</p>
                    </div>
                </main>
            ) : (
                <main className="content">
                    <header className="content-header">
                        <div>                          
                            <h1>Control de asistencias</h1>
                        </div>
                        <div className="header-actions-row">
                            <label className="month-filter-field">
                                <span>Mes</span>
                                <select
                                    value={selectedMonth}
                                    onChange={(event) => setSelectedMonth(Number(event.target.value))}
                                    className="month-filter-select"
                                >
                                    {meses.map((mes) => (
                                        <option key={mes.id} value={mes.id}>
                                            {mes.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="excel-upload-wrapper">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    hidden
                                    onChange={handleExcelUpload}
                                />
                                <button className="primary-btn" onClick={handleOpenFileDialog} disabled={isUploading}>
                                   Cargar Excel de asistencia
                                </button>
                            </div>
                        </div>
                    </header>

                    <section className="stats-grid">
                        {statsCards.map((card) => (
                            <button
                                type="button"
                                className={`stat-card ${card.tone} stat-card-button`}
                                key={card.label}
                                onClick={() => setSelectedCard(card)}
                            >
                                <div className="stat-header">
                                    <span className="stat-label">{card.label}</span>
                                    <span className="stat-icon">{card.icon}</span>
                                </div>
                                <p className="stat-value">{card.value}</p>
                                <span className="stat-trend">{card.detail}</span>
                            </button>
                        ))}
                    </section>

                    <section className="panel dashboard-summary-panel" style={{ marginTop: '24px' }}>
                        <div className="panel-header">
                            <h2>Resumen por docente</h2>
                            <span className="tag">{meses.find((mes) => Number(mes.id) === Number(selectedMonth))?.descripcion || 'Mes'}</span>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Docente</th>
                                        <th>Faltas por mes</th>
                                        <th>Justificaciones</th>
                                        <th>Atrasos</th>
                                        <th>Feriados</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teacherSummary.map((teacher) => (
                                        <tr key={teacher.nombre}>
                                            <td className="employee-name">{teacher.nombre}</td>
                                            <td>
                                                <span className="count-pill faltas">{teacher.faltas}</span>
                                            </td>
                                            <td>
                                                <span className="count-pill extras">{teacher.justificaciones}</span>
                                            </td>
                                            <td>
                                                <span className="count-pill atrasos">{teacher.atrasos}</span>
                                            </td>
                                            <td>
                                                <span className="count-pill feriados-pill">{teacher.feriados}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main> 
            )}

            {selectedCard && (
                <div className="card-detail-modal-overlay" onClick={() => setSelectedCard(null)}>
                    <div className="card-detail-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="card-detail-modal-header">
                            <div>
                                <p className="card-detail-kicker">Mes seleccionado</p>
                                <h3>{selectedCard.label}</h3>
                            </div>
                            <button type="button" className="card-detail-close" onClick={() => setSelectedCard(null)}>
                                ×
                            </button>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Docente</th>
                                        <th>Detalle</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCardRows.length > 0 ? (
                                        selectedCardRows.map((row, index) => (
                                            <tr key={`${selectedCard.key}-${row.fecha}-${row.docente || index}`}>
                                                <td>{row.fecha}</td>
                                                <td>{row.docente || '-'}</td>
                                                <td>{row.detalle}</td>
                                                <td>{row.tipo}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="card-detail-empty">No hay registros para este filtro.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default PrincipalPage;