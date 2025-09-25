import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/tareas`
let token = null

const setToken = newToken => {
  token = newToken ? `Bearer ${newToken}` : null
}

const obtenerMisTareas = async () => {
  if (!token) {
    throw new Error('Token no establecido')
  }

  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.get(`${baseUrl}/mis-tareas`, config)
    return response.data
  } catch (error) {
    console.error('Error al obtener tareas:', error)
    throw error
  }
}

const crearTarea = async newObject => {
  if (!token) {
    throw new Error('Token no establecido')
  }

  const config = {
    headers: { Authorization: token }
  }
  
  try {
    console.log('Enviando tarea:', newObject)
    console.log('Configuración:', config)
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  } catch (error) {
    console.error('Error detallado:', {
      mensaje: error.message,
      respuesta: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
}

const responderTarea = async (tareaId, respuestas) => {
  if (!token) {
    throw new Error('Token no establecido')
  }

  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.post(`${baseUrl}/${tareaId}/responder`, respuestas, config)
    return response.data
  } catch (error) {
    console.error('Error al responder tarea:', error)
    throw error
  }
}

// Exportamos todas las funciones
export {
  crearTarea,
  setToken,
  obtenerMisTareas,
  responderTarea
}