import axios from 'axios'

// Cliente HTTP central. Todo el front debe importar `api` desde aquí.
//
// Autenticación: Sanctum SPA basada en COOKIE de sesión (no tokens).
//   - withCredentials: envía/recibe la cookie de sesión.
//   - withXSRFToken: axios lee la cookie XSRF-TOKEN y manda el header
//     X-XSRF-TOKEN que Laravel valida en peticiones que mutan estado.
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Base del backend para /sanctum/csrf-cookie (que NO cuelga de /api).
const backendURL =
  import.meta.env.VITE_BACKEND_URL || apiURL.replace(/\/api\/?$/, '')

export const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Pide la cookie CSRF al backend. Debe llamarse antes del login (y de cualquier
// POST/PUT/DELETE si la sesión aún no tiene cookie XSRF).
export async function ensureCsrf() {
  await axios.get(`${backendURL}/sanctum/csrf-cookie`, { withCredentials: true })
}

// Interceptor: si el backend responde 401, limpiamos la sesión local y vamos
// a /login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ips_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
