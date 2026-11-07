import CatalogTable from '../../components/CatalogTable'
import { getVacunas } from '../../api/catalogos'

export default function Vacunas() {
  return (
    <CatalogTable
      titulo="Vacunas"
      descripcion="Catálogo de vacunas."
      fetcher={getVacunas}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
      ]}
    />
  )
}
