import React, {  useState } from 'react'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({children}) => {

    const [isAutenticated, setisAutenticated] = useState(false);
    const [usuario, setUsuario] = useState()
  return (
    <AuthContext.Provider value={{isAutenticated, setisAutenticated,
        usuario, setUsuario
    }}>
      {children}
    </AuthContext.Provider>
  )
}
