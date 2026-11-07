import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { homeForRole } from '../config/navigation'

// Protege rutas: exige sesión y, opcionalmente, un rol permitido.
// Uso: <ProtectedRoute roles={['Administrador']}><Layout/></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user.rol)) {
    // Autenticado pero sin permiso para esta sección: lo mandamos a su home.
    return <Navigate to={homeForRole(user.rol)} replace />
  }

  return children
}
