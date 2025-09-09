import { useEffect, useState } from "react"
import userService from "../services/userService"
import Menu from "../components/Menu"

const ListaUsuarios = ({ user }) => {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const datos = await userService.getAll()
      setUsuarios(datos)
    }
    fetchUsers()
  }, [])

  return (
    <div>
      <h2>Usuarios Registrados</h2>
      {usuarios.length === 0
        ? <p>No hay usuarios aún.</p>
        : (
          <ul>
            {usuarios.map(u => (
              <li key={u.id}>
                <strong>Nombre de usuario: {u.username}</strong> Nombre:({u.name}) — Rol: <em>{u.Rol || "Sin rol"}</em>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

export default ListaUsuarios
