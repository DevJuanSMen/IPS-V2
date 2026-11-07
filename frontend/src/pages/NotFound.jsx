import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { homeForRole } from '../config/navigation'

export default function NotFound() {
  const { user, isAuthenticated } = useAuth()
  const home = isAuthenticated ? homeForRole(user.rol) : '/login'

  return (
    <div className="page page--center">
      <h1>404</h1>
      <p className="muted">La página que buscas no existe.</p>
      <Link className="btn btn--primary" to={home}>
        Volver al inicio
      </Link>
    </div>
  )
}
