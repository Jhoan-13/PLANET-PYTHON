// src/pages/Crear.jsx
import { useState } from "react"
import userService from "../services/userService"
import Menu from "../components/Menu"
import ListaUsuarios from "../components/ListaUsuarios"

const Crear = ({ user }) => {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [Rol, setRol] = useState("usuario")
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const newUser = {
        username,
        name,
        password,
        Rol
      }
      
      await userService.create(newUser)
      setMessage("✅ Usuario creado correctamente")
      
      // Limpiar formulario
      setUsername("")
      setName("")
      setPassword("")
      setRol("usuario")
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      console.error('Error:', error)
      setMessage(`❌ ${error.response?.data?.error || error.message}`)
    }

    setTimeout(() => setMessage(null), 4000)
  }

  return (
    <div>
      <Menu user={user} />
      <h2>Crear Usuario</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario: </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <div>
          <label>Nombre: </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div>
          <label>Rol: </label>
          <select 
            value={Rol} 
            onChange={e => setRol(e.target.value)}
            required
          >
            <option value="usuario">Usuario</option>
            <option value="profesor">Profesor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <button type="submit">Crear</button>
      </form>
      <ListaUsuarios user={user}/>
    </div>
  )
}

export default Crear