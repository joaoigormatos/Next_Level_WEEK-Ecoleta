import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.2.6:3880/'
})

export default api;