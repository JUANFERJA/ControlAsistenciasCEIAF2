import React from 'react'

const exportHtmlTable = (filename, title, headers, rows) => {
    const normalizeCellValue = (cell) => {
        if (cell && typeof cell === 'object' && 'value' in cell) {
            return cell.value ?? '';
        }

        return cell ?? '';
    };

    const htmlRows = rows.map((row) => {
        const cells = row.map((cell) => {
            const value = normalizeCellValue(cell);

            if (cell && typeof cell === 'object' && cell.type === 'separator') {
                return `<td colspan="${headers.length}" style="height: 10px; background: #f8fafc; border: 1px solid #cbd5e1;"></td>`;
            }

            const bgColor = cell && typeof cell === 'object' ? (cell.bgcolor || '') : '';
            const textColor = cell && typeof cell === 'object' ? (cell.textColor || '#111827') : '#111827';

            const style = [
                'padding: 8px 10px;',
                'border: 1px solid #cbd5e1;',
                bgColor ? `background-color: ${bgColor};` : '',
                `color: ${textColor};`,
                bgColor ? 'font-weight: 700;' : ''
            ].join(' ');

            return `<td style="${style}">${String(value)}</td>`;
        }).join('');

        return `<tr>${cells}</tr>`;
    }).join('');

    const headerCells = headers.map((header) => (
        `<th style="padding: 10px; border: 1px solid #cbd5e1; background: ${header.bgcolor || '#eff6ff'}; color: ${header.textColor || '#0f172a'}; text-align: left;">${header.label}</th>`
    )).join('');

    const html = `
        <html>
            <head>
                <meta charset="utf-8" />
                <title>${title}</title>
            </head>
            <body>
                <h2 style="font-family: Arial; color: #0f172a; margin-bottom: 12px;">${title}</h2>
                <table style="border-collapse: collapse; width: 100%; font-family: Arial; font-size: 12px;">
                    <thead>
                        <tr>${headerCells}</tr>
                    </thead>
                    <tbody>${htmlRows}</tbody>
                </table>
            </body>
        </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};

const styleMap = {
    normal: { label: 'Asistencia normal', bgcolor: '#dcfce7', textColor: '#166534' },
    atraso: { label: 'Atraso', bgcolor: '#fef3c7', textColor: '#92400e' },
    falta: { label: 'Falta', bgcolor: '#fee2e2', textColor: '#991b1b' },
    'fin-semana': { label: 'Fin de semana', bgcolor: '#e2e8f0', textColor: '#475569' },
    futuro: { label: 'Futuro', bgcolor: '#dbeafe', textColor: '#1d4ed8' },
    'fin-semana-extra': { label: 'Asistencia extra', bgcolor: '#dcfce7', textColor: '#166534' },
    extra: { label: 'Asistencia extra', bgcolor: '#dcfce7', textColor: '#166534' },
    'no-horario': { label: 'Sin horario', bgcolor: '#dbeafe', textColor: '#1e3a8a' }
};

const parseFechaLocal = (value) => {
    if (!value) return null;

    const raw = String(value).split('T')[0];
    if (!raw) return new Date(value);

    const [year, month, day] = raw.split('-').map(Number);
    if (!year || !month || !day) return new Date(value);

    return new Date(year, month - 1, day, 12, 0, 0);
};

const formatFechaReporte = (value) => {
    if (!value) return '--';

    const date = parseFechaLocal(value);
    if (!date || Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
    }).format(date);
};

export const ReporteAsistenciaByDocenteModal = ({params, closeModal}) => {
    const { docente, data, dias, mes } = params;    
    data.sort((a, b) => {
        const first = parseFechaLocal(a.fecha)?.getTime() ?? 0;
        const second = parseFechaLocal(b.fecha)?.getTime() ?? 0;
        return first - second;
    });
    console.log("mis registros", data)
    const exportDetalleDocente = () => {
        const headers = [
            { label: 'Fecha', bgcolor: '#dbeafe', textColor: '#0f172a' },
            { label: 'Hora ingreso', bgcolor: '#e2e8f0', textColor: '#0f172a' },
            { label: 'Hora salida', bgcolor: '#e2e8f0', textColor: '#0f172a' },
            { label: 'Estado', bgcolor: '#fef3c7', textColor: '#0f172a' }
        ];

        const rows = data.map((item) => {
            const estadoClave = item.clase || item.estado || 'normal';
            const estado = styleMap[estadoClave] || styleMap.normal;
            const detalle = item.detalle || estado.label;

            return [
                { value: formatFechaReporte(item.fecha || item.nombreDia) },
                { value: item.horaIngreso || '--:--' },
                { value: item.horaSalida || '--:--' },
                { value: detalle, bgcolor: estado.bgcolor, textColor: estado.textColor }
            ];
        });

        exportHtmlTable(
            `reporte_detalle_${docente?.nombre || 'docente'}_${mes?.descripcion || 'mes'}.xls`,
            `Reporte detallado - ${docente ? `${docente.nombre} ${docente.apellido || ''}`.trim() : 'Docente'} - ${mes?.descripcion || ''}`,
            headers,
            rows
        );
    };

    console.log("mis datos", data)
    return (
        <div className="docentes-modal-overlay" onClick={closeModal}>
          <div className="docentes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="docentes-modal-header">
              <h3>
                {`${docente?.nombre || ''} ${docente?.apellido || ''}`.trim()} - {mes?.descripcion || 'Mes'}
              </h3>
              <div className="docentes-modal-actions">
                <button className="docentes-modal-export" onClick={(e) => {
                    e.stopPropagation();
                    exportDetalleDocente();
                }}>
                  Exportar Excel
                </button>
                <button className="docentes-modal-close" onClick={closeModal}>×</button>
              </div>
            </div>

            <div className="docentes-modal-body">
              <div className="docentes-table-wrap">
                <table className="docentes-modal-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora ingreso</th>
                      <th>Hora salida</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                        const estadoClave = item.clase || item.estado || 'normal';
                        const estado = styleMap[estadoClave] || styleMap.normal;

                        return (
                            <tr key={`${item.idDocente || item.fecha || index}${index}`}>
                              <td>{item.fecha}</td>
                              <td>{item.horaIngreso || '--:--'}</td>
                              <td>{item.horaSalida || '--:--'}</td>
                              <td>
                                <span className={`estado-badge ${item.clase || item.estado || 'normal'}`}>
                                  {item.detalle || estado.label}
                                </span>
                              </td>
                            </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> 
  )
}
