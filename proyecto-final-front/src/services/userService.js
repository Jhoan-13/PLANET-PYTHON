// src/services/userService.js
import axios from 'axios'
import { BASE_URL } from './config'

const baseUrl = `${BASE_URL}/users`

const createUser = async userData => {
  try {
    const response = await axios.post(baseUrl, userData)
    return response.data
  } catch (error) {
    // Mejorar el manejo del error para mostrar el mensaje específico del backend
    const errorMessage = error.response?.data?.error || 'Error al crear el usuario'
    throw new Error(errorMessage)
  }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getMakers = async () => {
  const response = await axios.get(`${baseUrl}/makers`)
  return response.data
}

const deleteUser = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default {
  getAll,
  createUser,
  getMakers,
  deleteUser
}