import api from "./api"

export async function register(name: string, email: string, password: string) {
  const response = await api.post('/auth/register', { name, email, password })
  return response.data
}

export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export async function forgotPassword(email: string) {
  const response = await api.post('/auth/forgot-password', { email })
  return response.data
}

export async function resetPassword(token: string, password: string) {
  const response = await api.post('/auth/reset-password', { token, password })
  return response.data
}