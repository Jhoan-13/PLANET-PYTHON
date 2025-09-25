import axios from 'axios'
import { BASE_URL } from './config'

const login = async credentials => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials)
    window.localStorage.setItem('loggedUser', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    console.error('Error en login:', error)
    throw error
  }
}

export default { login }