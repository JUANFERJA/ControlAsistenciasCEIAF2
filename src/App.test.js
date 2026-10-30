import { fireEvent, render, screen } from '@testing-library/react';
import { DataContext } from './context/DataContext';
import { VacacionesPage } from './pages/VacacionesPage';

test('renders vacation filters and opens create modal', () => {
  const docentes = [
    { id: 1, nombre: 'Ana', apellido: 'Pérez' },
    { id: 2, nombre: 'Luis', apellido: 'García' }
  ];

  render(
    <DataContext.Provider value={{ docentes, setDocentes: jest.fn(), vacaciones: [], setVacaciones: jest.fn() }}>
      <VacacionesPage />
    </DataContext.Provider>
  );

  expect(screen.getByText(/vacaciones/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/docente/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/año/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /nuevo registro/i }));

  expect(screen.getByText(/nuevo registro de vacaciones/i)).toBeInTheDocument();
  expect(screen.getAllByText(/docente/i).length).toBeGreaterThan(0);
});
