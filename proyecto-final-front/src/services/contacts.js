import axios from 'axios'
const baseUrl = '/api/contacts'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
 
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/${id}/number`, updatedObject)
  return response.data
}

const remove = async (id) => {

  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}


export default { getAll, remove, create, update }