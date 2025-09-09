// src/services/userService.js
import axios from 'axios'
const baseUrl = '/api/users'

const createUser = async userData => {
  const response = await axios.post(baseUrl, userData)
  return response.data
}
const getAll = async () => {
  const response = await axios.get('/api/users')
  return response.data
}

export default { createUser, getAll }

