import axios from 'axios'
import { BASE_URL } from './config'

const login = async credentials => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials)
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Error de conexión')
  }
}

export default { login }