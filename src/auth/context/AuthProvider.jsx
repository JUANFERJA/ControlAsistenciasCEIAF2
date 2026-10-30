import React, {  useState } from 'react'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({children}) => {

    var autenticated = localStorage.getItem("isAutenticated")
    const [isAutenticated, setisAutenticated] = useState(autenticated);
    const [usuario, setUsuario] = useState()
  return (
    <AuthContext.Provider value={{isAutenticated, setisAutenticated,
        usuario, setUsuario
    }}>
      {children}
    </AuthContext.Provider>
  )
}
