import CatalogTable from '../../components/CatalogTable'
import { getAlergias } from '../../api/catalogos'

export default function Alergias() {
  return (
    <CatalogTable
      titulo="Alergias"
      descripcion="Catálogo de alergias."
      fetcher={getAlergias}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
      ]}
    />
  )
}
