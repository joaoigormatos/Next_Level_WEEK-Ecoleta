import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3880/'
})

export default api;