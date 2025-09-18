import { useEffect, useState } from "react"
import userService from "../services/userService"
import Menu from "../components/Menu"

const ListaUsuarios = ({ user }) => {
  const [usuarios, setUsuarios] = useState([])
  const [message, setMessage] = useState(null)

  const fetchUsers = async () => {
    const datos = await userService.getAll()
    setUsuarios(datos)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id, username) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${username}?`)) {
      try {
        await userService.deleteUser(id)
        setMessage(`✅ Usuario ${username} eliminado correctamente`)
        // Actualizar la lista de usuarios
        fetchUsers()
      } catch (error) {
        console.error(error)
        setMessage(`❌ Error al eliminar el usuario: ${error.response?.data?.error || error.message}`)
      }
      setTimeout(() => setMessage(null), 4000)
    }
  }

  return (
    <div>
      <h2>Usuarios Registrados</h2>
      {message && <p className="message">{message}</p>}
      {usuarios.length === 0
        ? <p>No hay usuarios aún.</p>
        : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {usuarios.map(u => (
              <li key={u.id} style={{ 
                margin: '10px 0', 
                padding: '10px', 
                border: '1px solid #ddd',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>Usuario: {u.username}</strong>
                  <br />
                  Nombre: {u.name}
                  <br />
                  Rol: <em>{u.Rol || "usuario"}</em>  {/* Cambiado de "Sin rol" a "usuario" */}
                </div>
                {/* No mostrar el botón de eliminar para el usuario actual */}
                {user?.username !== u.username && (
                  <button 
                    onClick={() => handleDelete(u.id, u.username)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

export default ListaUsuarios