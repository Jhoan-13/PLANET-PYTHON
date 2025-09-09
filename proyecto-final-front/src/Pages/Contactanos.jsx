import { useState, useEffect, useRef } from 'react'
import blogService from '../services/blogs'
import LoginForm from '../components/Login'
import loginService from '../services/login'
import Notification from '../components/Notification'
import Menu from "../components/Menu"
import { setToken as setTareasToken } from '../services/tareasService'

const Contactanos = ({ user: userProp, setUser: setUserProp }) => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs(blogs)
      })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userData = await loginService.login({ 
        username, 
        password
      })

      // Verificamos que tengamos toda la información necesaria
      if (!userData.userId || !userData.Rol) {
        throw new Error('Información de usuario incompleta')
      }

      // Creamos el objeto de usuario completo según la respuesta del backend
      const userToSave = {
        username: userData.username,
        name: userData.name,
        token: userData.token,
        Rol: userData.Rol,
        id: userData.userId // Usamos userId que viene del backend
      }

      // Guardamos en localStorage
      window.localStorage.setItem(
        'loggedBlogappUser', 
        JSON.stringify(userToSave)
      )

      // Configuramos los tokens
      blogService.setToken(userData.token)
      setTareasToken(userData.token)

      // Actualizamos el estado global
      setUserProp(userToSave)
      
      // Limpiamos campos
      setUsername('')
      setPassword('')
      
      setMessage({
        message: `Bienvenido ${userData.name} (${userData.Rol})`,
        type: true
      })

      // Log para debugging
      console.log('Usuario logueado:', {
        id: userData.userId,
        rol: userData.Rol,
        token: userData.token?.substring(0, 10) + '...'
      })

    } catch (error) {
      console.error('Error en login:', error)
      setMessage({
        message: error.response?.data?.error || 'Error en el inicio de sesión',
        type: false
      })
    }
    setTimeout(() => setMessage(null), 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUserProp(null)
    blogService.setToken(null)
    setTareasToken(null)
  }

  // Funciones faltantes para el manejo de blogs
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage({
        message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: true
      })
    } catch (error) {
      setMessage({
        message: error.response.data.error,
        type: false
      })
    }
    setTimeout(() => setMessage(null), 5000)
  }

  const updatedBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (error) {
      setMessage({
        message: error.response.data.error,
        type: false
      })
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      setMessage({
        message: error.response.data.error,
        type: false
      })
    }
  }

  // Ordenar blogs por likes
  const orderBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

return (
  <div>
    {!userProp ? (
      <div>
        <Menu user={userProp}/>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          message={message}
        />
      </div>
    ) : (
        <>
          <Menu user={userProp}/>
          <h2>Blogs</h2>
          <Notification message={message} />
          <p>
            {userProp.name} ({userProp.Rol}) conectado{' '}
            <button onClick={handleLogout}>Cerrar sesión</button>
          </p>
        </>
      )}
    </div>
  )
}

export default Contactanos