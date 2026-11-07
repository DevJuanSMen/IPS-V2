import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { USE_MOCK } from '../api/auth'

export default function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      {USE_MOCK && (
        <span className="badge badge--warn" title="El front está usando datos simulados (VITE_USE_MOCK=true)">
          MODO DEMO
        </span>
      )}
      <div className="topbar__spacer" />
      <div className="topbar__user">
        <span className="topbar__avatar">{(user?.nombre || '?').charAt(0).toUpperCase()}</span>
        <div className="topbar__userinfo">
          <strong>{user?.nombre || user?.usuario}</strong>
          <small>{user?.rol}</small>
        </div>
      </div>
      <button className="btn btn--ghost" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </header>
  )
}
