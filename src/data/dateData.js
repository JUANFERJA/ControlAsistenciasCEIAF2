export const dateData = () => {
  const meses = [
    { id: 1, descripcion: 'Enero' },
    { id: 2, descripcion: 'Febrero' },
    { id: 3, descripcion: 'Marzo' },
    { id: 4, descripcion: 'Abril' },
    { id: 5, descripcion: 'Mayo' },
    { id: 6, descripcion: 'Junio' },
    { id: 7, descripcion: 'Julio' },
    { id: 8, descripcion: 'Agosto' },
    { id: 9, descripcion: 'Septiembre' },
    { id: 10, descripcion: 'Octubre' },
    { id: 11, descripcion: 'Noviembre' },
    { id: 12, descripcion: 'Diciembre' }
  ];

  const dias = [
    { id: 1, descripcion: 'Lunes' },
    { id: 2, descripcion: 'Martes' },
    { id: 3, descripcion: 'Miércoles' },
    { id: 4, descripcion: 'Jueves' },
    { id: 5, descripcion: 'Viernes' },
    { id: 6, descripcion: 'Sábado' },
    { id: 7, descripcion: 'Domingo' }
  ];
  const anchos = [
    "250px", // Nombre
    "100px", // Mes
    "100px", // Faltas
    "100px", // Atrasos
    "100px"  // Extras
];
const headers = [
            { label: 'Docente', bgcolor: '#dbeafe', textColor: '#0f172a' },
            { label: 'Fecha', bgcolor: '#e2e8f0', textColor: '#0f172a' },
            { label: 'Hora desde', bgcolor: '#fef3c7', textColor: '#0f172a' },
            { label: 'Hora hasta', bgcolor: '#fef3c7', textColor: '#0f172a' },
            { label: 'Descripción', bgcolor: '#dcfce7', textColor: '#0f172a' }
        ];

  return { meses, dias, anchos, headers };
};



