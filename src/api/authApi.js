import { request } from './http.js'

export async function registerUser(credentials) {
  return request('/api/auth/register', {
    method: 'POST',
    body: credentials
  })
}

export async function loginUser(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: credentials
  })
}

export async function getCurrentUser(token) {
  const payload = await request('/api/auth/me', {
    method: 'GET',
    token
  })

  return payload.user
}
