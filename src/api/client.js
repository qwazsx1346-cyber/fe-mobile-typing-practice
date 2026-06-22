import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refreshToken')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken: refresh })
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          err.config.headers.Authorization = `Bearer ${data.accessToken}`
          return axios(err.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  signup: body => api.post('/auth/signup', body),
  login: body => api.post('/auth/login', body),
  me: () => api.get('/auth/me'),
}

export const practiceApi = {
  save: body => api.post('/practice/sessions', body),
  history: period => api.get('/practice/sessions', { params: { period } }),
  stats: () => api.get('/practice/stats'),
  ranking: region => api.get('/practice/ranking', { params: region ? { region } : {} }),
}

export default api
