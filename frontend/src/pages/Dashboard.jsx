import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { navForRole } from '../config/navigation'

// Inicio de cada rol: muestra tarjetas con accesos directos a sus módulos.
export default function Dashboard() {
  const { user } = useAuth()
  const items = navForRole(user?.rol).filter((i) => i.label !== 'Inicio')

  return (
    <div className="page">
      <div className="page__header">
        <h1>Bienvenido, {user?.nombre || user?.usuario}</h1>
        <p className="muted">Rol: {user?.rol}</p>
      </div>

      <div className="cards-grid">
        {items.map((item) => (
          <Link key={item.path} to={item.path} className="card card--link">
            <span className="card__icon">{item.icon}</span>
            <strong>{item.label}</strong>
            <p className="muted">{item.descripcion}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
