import { useAuth } from '../auth/AuthContext'

// Perfil del usuario. Base para "Perfil / Cambiar contraseña / Cambiar foto"
// del módulo Usuario del sistema legacy.
export default function Perfil() {
  const { user } = useAuth()

  return (
    <div className="page">
      <div className="page__header">
        <h1>Mi perfil</h1>
      </div>

      <div className="card">
        <dl className="definition">
          <dt>Usuario</dt>
          <dd>{user?.usuario}</dd>
          <dt>Nombre</dt>
          <dd>{user?.nombre || '—'}</dd>
          <dt>Rol</dt>
          <dd>{user?.rol}</dd>
          <dt>Estado</dt>
          <dd>{user?.estado || 'Activo'}</dd>
        </dl>
      </div>

      <div className="card">
        <h2>Cambiar contraseña</h2>
        <p className="muted">
          Pendiente de implementar: <code>PUT /api/perfil/password</code>.
        </p>
      </div>
    </div>
  )
}
