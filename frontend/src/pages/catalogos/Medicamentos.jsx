import CatalogTable from '../../components/CatalogTable'
import { getMedicamentos } from '../../api/catalogos'

export default function Medicamentos() {
  return (
    <CatalogTable
      titulo="Medicamentos"
      descripcion="Catálogo de medicamentos del sistema."
      fetcher={getMedicamentos}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
      ]}
    />
  )
}
