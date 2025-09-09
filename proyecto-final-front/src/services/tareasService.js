import axios from 'axios'
const baseUrl = '/api/tareas'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const crearTarea = async (tarea) => {
  if (!token) {
    throw new Error('Token no disponible')
  }

  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.post(baseUrl, {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaLimite: tarea.fechaLimite,
      preguntas: tarea.preguntas.map(p => ({
        pregunta: p.pregunta,
        opciones: p.opciones.map(o => ({
          texto: o.texto,
          esCorrecta: o.esCorrecta
        }))
      }))
    }, config)
    return response.data
  } catch (error) {
    throw error.response?.data?.error || error.message
  }
}

export const obtenerMisTareas = async () => {
  if (!token) {
    throw new Error('Token no disponible')
  }

  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.get(`${baseUrl}/mis-tareas`, config)
    return response.data
  } catch (error) {
    throw error.response?.data?.error || error.message
  }
}

export const responderTarea = async (tareaId, preguntaIndex, respuestaIndex) => {
  if (!token) {
    throw new Error('Token no disponible')
  }

  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.post(`${baseUrl}/${tareaId}/responder`, {
      preguntaIndex,
      respuestaIndex
    }, config)
    return response.data
  } catch (error) {
    throw error.response?.data?.error || error.message
  }
}

export { setToken }