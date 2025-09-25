import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/tareas`

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getMine = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(`${baseUrl}/mis-tareas`, config)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const answer = async (id, answerData) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/${id}/responder`, answerData, config)
  return response.data
}

export default { getAll, getMine, create, answer, setToken }