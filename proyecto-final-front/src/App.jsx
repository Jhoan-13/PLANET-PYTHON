import { useState, useEffect } from 'react'
import AppRoutes from './ROUTS/AppRouts'
import { setToken } from './services/tareasService'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedUser = () => {
      try {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          setUser(user)
          setToken(user.token)
        }
      } catch (error) {
        console.error('Error al cargar la sesión:', error)
        window.localStorage.removeItem('loggedUser')
      } finally {
        setLoading(false)
      }
    }

    checkLoggedUser()

    // Agregar evento para verificar cambios en localStorage
    window.addEventListener('storage', checkLoggedUser)
    return () => window.removeEventListener('storage', checkLoggedUser)
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <AppRoutes 
        user={user} 
        setUser={setUser}
      />
    </div>
  )
}

export default App