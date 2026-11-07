import { useEffect, useState } from 'react'

// Tabla de catálogo reutilizable: búsqueda (con debounce) + paginación servidor.
// Props:
//   titulo, descripcion
//   fetcher({ search, page, perPage }) -> { data, meta }
//   columns: [{ key, label, render? }]
//   searchable (default true)
export default function CatalogTable({
  titulo,
  descripcion,
  fetcher,
  columns,
  searchable = true,
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    const t = setTimeout(() => {
      fetcher({ search, page, perPage: 15 })
        .then((res) => {
          if (!active) return
          setRows(res.data || [])
          setMeta(res.meta || null)
        })
        .catch(() => active && setError('No se pudo cargar la información.'))
        .finally(() => active && setLoading(false))
    }, 300)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [search, page, fetcher])

  function onSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>{titulo}</h1>
        {descripcion && <p className="muted">{descripcion}</p>}
      </div>

      <div className="card">
        {searchable && (
          <input
            className="input"
            type="search"
            placeholder="Buscar…"
            value={search}
            onChange={onSearch}
          />
        )}

        {error && <div className="alert alert--error">{error}</div>}

        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="muted">
                  Cargando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="muted">
                  Sin resultados.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(r) : (r[c.key] ?? '—')}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {meta && (
          <div className="pagination">
            <button
              className="btn"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span className="muted">
              Página {meta.current_page} de {meta.last_page} · {meta.total} registros
            </span>
            <button
              className="btn"
              disabled={page >= meta.last_page || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
