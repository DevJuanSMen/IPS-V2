import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { homeForRole } from '../config/navigation'
import { USE_MOCK } from '../api/auth'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const user = await login(usuario, password)
      const from = location.state?.from?.pathname
      navigate(from || homeForRole(user.rol), { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Usuario o contraseña incorrectos.'
      setError(msg)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit}>
        <div className="login__brand">
          <span className="login__logo">🏥</span>
          <h1>IPS v2</h1>
          <p>Sistema de citas e historias clínicas</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <label className="field">
          <span>Usuario</span>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoFocus
            autoComplete="username"
            placeholder="Nombre de usuario"
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>

        <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        {USE_MOCK && (
          <p className="login__hint">
            <strong>Modo demo activo.</strong> Escribe cualquier usuario y usa como
            contraseña el nombre del rol que quieras explorar: <code>Administrador</code>,{' '}
            <code>Admisionista</code>, <code>Administrativo</code>, <code>Medico</code>,{' '}
            <code>Odontologo</code>, <code>Psicologo</code>, <code>PYP</code> o{' '}
            <code>Paciente</code>.
          </p>
        )}
      </form>
    </div>
  )
}
