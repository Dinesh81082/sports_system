import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

export const teamsAPI = {
  getAll:  ()       => API.get('/teams'),
  getOne:  (id)     => API.get(`/teams/${id}`),
  create:  (data)   => API.post('/teams', data),
  update:  (id, data) => API.put(`/teams/${id}`, data),
  remove:  (id)     => API.delete(`/teams/${id}`),
}

export const playersAPI = {
  getAll:  ()       => API.get('/players'),
  getOne:  (id)     => API.get(`/players/${id}`),
  create:  (data)   => API.post('/players', data),
  update:  (id, data) => API.put(`/players/${id}`, data),
  remove:  (id)     => API.delete(`/players/${id}`),
}

export const coachesAPI = {
  getAll:  ()       => API.get('/coaches'),
  getOne:  (id)     => API.get(`/coaches/${id}`),
  create:  (data)   => API.post('/coaches', data),
  update:  (id, data) => API.put(`/coaches/${id}`, data),
  remove:  (id)     => API.delete(`/coaches/${id}`),
}

export const matchesAPI = {
  getAll:  ()       => API.get('/matches'),
  getOne:  (id)     => API.get(`/matches/${id}`),
  create:  (data)   => API.post('/matches', data),
  update:  (id, data) => API.put(`/matches/${id}`, data),
  remove:  (id)     => API.delete(`/matches/${id}`),
}

export const scoresAPI = {
  getAll:  ()       => API.get('/scores'),
  create:  (data)   => API.post('/scores', data),
  update:  (id, data) => API.put(`/scores/${id}`, data),
  remove:  (id)     => API.delete(`/scores/${id}`),
}
