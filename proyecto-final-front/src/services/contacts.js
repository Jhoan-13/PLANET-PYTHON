import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/contacts`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getMine = async () => {
  const response = await axios.get(`${baseUrl}/mis-tareas`)
  return response.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

export default { getAll, create, update }