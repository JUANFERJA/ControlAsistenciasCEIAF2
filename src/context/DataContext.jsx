import React, { createContext } from 'react'

export const DataContext = createContext({
  docentes: [],
  setDocentes: () => {},
  vacaciones: [],
  setVacaciones: () => {},
  novedades: [],
  setNovedades: () => {},
  feriados: [],
  setFeriados: () => {}
});