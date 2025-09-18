import { useState } from 'react'
import loginService from '../services/login'
import { setToken as setTareasToken } from '../services/tareasService'
import './css/login.css'

const Login = ({ handleLogin: parentHandleLogin, username, setUsername, password, setPassword, message }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const user = await parentHandleLogin(event)
      // Asegurarse de que el usuario se guarde en localStorage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setToken(user.token)
      
    } catch (error) {
      console.error('Error en login:', error)
      setMensaje("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {message && (
        <div className={`message ${message.type ? 'success' : 'error'}`}>
          {message.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={username}
            name="Username"
            placeholder="Usuario"
            onChange={({ target }) => setUsername(target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            name="Password"
            placeholder="Contraseña"
            onChange={({ target }) => setPassword(target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  )
}

export default Login