import { dateData } from "../data/dateData";
    const { anchos, meses } = dateData();


export const reporteDocenteFunctions = () => {
    
   const exportarResumen = (mesDescripcion) => {
      const tabla = document.querySelector(".table-card table");
  
      let html = `
          <html>
          <head>
              <meta charset="UTF-8">
          </head>
          <body>
  
          <table style="border-collapse: collapse; width: 100%;">
      `;
  
      tabla.querySelectorAll("tr").forEach((fila) => {
  
          html += "<tr>";
  
          fila.querySelectorAll("th, td").forEach((celda, index) => {
              if (index === 5) return;
              const esHeader = celda.tagName === "TH";
  
              let style = `
                  border: 1px solid #999999;
                  padding: 8px;
                  text-align: center;
                  font-family: Arial;
                   width: ${anchos[index]};
              `;
  
              // HEADER
              if (esHeader) {
                  style += `
                      background-color: #2563eb;
                      color: white;
                      font-weight: bold;
                  `;
              }
  
              // Nombre del docente
              if (celda.classList.contains("teacher-name")) {
                  style += `
                      text-align: left;
                      font-weight: bold;
                  `;
              }
  
              // Buscar el span interno
              const contador = celda.querySelector(".count-pill");
  
              if (contador) {
  
                  if (contador.classList.contains("faltas")) {
                      style += `
                          background-color: #F4CCCC;
                          color: #990000;
                          font-weight: bold;
                      `;
                  }
  
                  if (contador.classList.contains("atrasos")) {
                      style += `
                          background-color: #FFF2CC;
                          color: #7F6000;
                          font-weight: bold;
                      `;
                  }
  
                  if (contador.classList.contains("extras")) {
                      style += `
                          background-color: #D9EAD3;
                          color: #274E13;
                          font-weight: bold;
                      `;
                  }
              }
  
              html += `
                  <${esHeader ? "th" : "td"} style="${style}">
                      ${celda.innerText}
                  </${esHeader ? "th" : "td"}>
              `;
          });
  
          html += "</tr>";
      });
  
      html += `
          </table>
          </body>
          </html>
      `;
  
      const blob = new Blob(
          ["\ufeff", html],
          {
              type: "application/vnd.ms-excel;charset=utf-8;"
          }
      );
  
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `ReporteDocentes_${mesDescripcion}.xls`;
      a.click();
  
      URL.revokeObjectURL(url);
      };
      const exportHtmlTableFromRows = (filename, title, headers, rows) => {
          const normalizeCellValue = (cell) => {
              if (cell && typeof cell === 'object') {
                  if (cell.type === 'separator') return '';
                  if ('value' in cell) return cell.value ?? '';
              }

              return cell ?? '';
          };

          const htmlRows = rows.map((row) => {
              const cells = row.map((cell) => {
                  if (cell && typeof cell === 'object' && cell.type === 'separator') {
                      return `<td colspan="${headers.length}" style="height: 10px; background: #f8fafc; border: 1px solid #cbd5e1;"></td>`;
                  }

                  const value = normalizeCellValue(cell);
                  const bgColor = cell && typeof cell === 'object' && 'bgcolor' in cell ? (cell.bgcolor || '') : '';
                  const textColor = cell && typeof cell === 'object' && 'textColor' in cell ? (cell.textColor || '#111827') : '#111827';

                  const style = [
                      'padding: 8px 10px;',
                      'border: 1px solid #cbd5e1;',
                      'text-align: left;',
                      bgColor ? `background-color: ${bgColor};` : '',
                      `color: ${textColor};`
                  ].join(' ');

                  return `<td style="${style}">${String(value)}</td>`;
              }).join('');

              return `<tr>${cells}</tr>`;
          }).join('');

          const headerCells = headers.map((header) => (
              `<th style="padding: 10px; border: 1px solid #cbd5e1; background: ${header.bgcolor || '#eff6ff'}; color: ${header.textColor || '#0f172a'}; text-align: left; font-weight: 700;">${header.label}</th>`
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

          const blob = new Blob([`\ufeff${html}`], { type: 'application/vnd.ms-excel;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);
      };
  
  return {
    exportarResumen,
    exportHtmlTableFromRows
  }
}
