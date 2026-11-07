// Stub genérico de un módulo todavía no implementado.
// router.jsx renderiza este componente para cada módulo del menú, pasándole
// el título y la descripción. Tu compañero reemplaza el stub por la pantalla
// real creando un componente propio y referenciándolo en router.jsx.
export default function ModulePlaceholder({ titulo, descripcion }) {
  return (
    <div className="page">
      <div className="page__header">
        <h1>{titulo}</h1>
      </div>

      <div className="card">
        <p className="muted">{descripcion}</p>
        <div className="placeholder">
          <span className="placeholder__icon">🚧</span>
          <div>
            <strong>Módulo pendiente de implementar</strong>
            <p className="muted">
              Esta es una pantalla base. Reemplázala creando tu componente en{' '}
              <code>src/pages/</code> y conectándolo en <code>src/router.jsx</code>.
              Usa el cliente <code>api</code> de <code>src/api/client.js</code> para
              llamar al backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
