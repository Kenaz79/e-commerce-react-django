import axios from 'axios';

const token = localStorage.getItem('access');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
