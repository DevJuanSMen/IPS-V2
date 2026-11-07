import { api, ensureCsrf } from './client'
import { ROLES } from '../config/navigation'

// ¿Modo mock? (sin backend). Controlado por VITE_USE_MOCK en .env
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK).toLowerCase() === 'true'

// -----------------------------------------------------------------------------
// MODO MOCK: permite navegar toda la UI sin backend.
// En el login, usuario = cualquiera y contraseña = nombre del rol a explorar.
// -----------------------------------------------------------------------------
const MOCK_ROLES = Object.values(ROLES)

async function mockLogin(usuario, password) {
  await new Promise((r) => setTimeout(r, 400))
  if (!usuario) {
    const err = new Error('Usuario requerido')
    err.response = { status: 422, data: { message: 'El usuario es obligatorio.' } }
    throw err
  }
  const match = MOCK_ROLES.find((r) => r.toLowerCase() === String(password).toLowerCase())
  const rol = match || ROLES.ADMINISTRADOR
  const user = { id: 1, usuario, nombre: usuario, rol, estado: 'Activo', _mock: true }
  localStorage.setItem('ips_user', JSON.stringify(user))
  return user
}

// -----------------------------------------------------------------------------
// MODO REAL: contra el backend Laravel (Sanctum SPA por cookie).
//   1. GET  /sanctum/csrf-cookie
//   2. POST /api/login   { usuario, password }  -> { user: {...} }
//   3. GET  /api/me
//   4. POST /api/logout
// -----------------------------------------------------------------------------
async function realLogin(usuario, password) {
  await ensureCsrf()
  const { data } = await api.post('/login', { usuario, password })
  const user = data.user
  localStorage.setItem('ips_user', JSON.stringify(user))
  return user
}

export async function login(usuario, password) {
  return USE_MOCK ? mockLogin(usuario, password) : realLogin(usuario, password)
}

export async function logout() {
  if (!USE_MOCK) {
    try {
      await api.post('/logout')
    } catch {
      /* ignoramos errores de red al cerrar sesión */
    }
  }
  localStorage.removeItem('ips_user')
}

// Verifica contra el backend si la sesión (cookie) sigue viva y refresca datos.
export async function fetchMe() {
  if (USE_MOCK) return currentUser()
  const { data } = await api.get('/me')
  localStorage.setItem('ips_user', JSON.stringify(data.user))
  return data.user
}

// Recupera el usuario actual desde localStorage (hidratación rápida).
export function currentUser() {
  try {
    const raw = localStorage.getItem('ips_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export { USE_MOCK }
