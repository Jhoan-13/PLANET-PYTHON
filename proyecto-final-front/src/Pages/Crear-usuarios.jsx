// src/pages/Crear.jsx
import { useState } from "react"
import userService from "../services/userService"
import Menu from "../components/Menu"
import ListaUsuarios from "../components/ListaUsuarios"

const Crear = ({ user }) => {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [Rol, setRol] = useState("user")
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newUser = { username, name, password, Rol }
      await userService.createUser(newUser)
      setMessage("✅ Usuario creado correctamente")
      setUsername("")
      setName("")
      setPassword("")
      setRol("user")
    } catch (error) {
      console.error(error.response?.data || error.message)
      setMessage(`❌ Error: ${error.response?.data?.error || "al crear usuario"}`)
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
          />
        </div>
        <div>
          <label>Rol: </label>
          <select value={Rol} onChange={e => setRol(e.target.value)}>
            <option value="user">Usuario</option>
             <option value="maker">Docente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Crear</button>
      </form>
      <ListaUsuarios/>
    </div>
  )
}

export default Crear
