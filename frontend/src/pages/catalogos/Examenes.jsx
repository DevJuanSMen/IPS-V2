import CatalogTable from '../../components/CatalogTable'
import { getExamenes } from '../../api/catalogos'

const money = (v) =>
  v ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v) : '—'

export default function Examenes() {
  return (
    <CatalogTable
      titulo="Exámenes"
      descripcion="Catálogo de exámenes (código y tarifa SOAT)."
      fetcher={getExamenes}
      columns={[
        { key: 'codigo', label: 'Código' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'tarifa_soat', label: 'Tarifa SOAT', render: (r) => money(r.tarifa_soat) },
      ]}
    />
  )
}
