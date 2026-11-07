import { api } from './client'

// Fábrica de "listadores" de catálogo. Cada uno acepta { search, page, perPage }
// y devuelve { data: [...], meta: { current_page, last_page, per_page, total } }.
function listador(path) {
  return async ({ search = '', page = 1, perPage = 15 } = {}) => {
    const { data } = await api.get(path, {
      params: { search, page, per_page: perPage },
    })
    return data
  }
}

export const getMedicamentos = listador('/catalogos/medicamentos')
export const getVacunas = listador('/catalogos/vacunas')
export const getAlergias = listador('/catalogos/alergias')
export const getExamenes = listador('/catalogos/examenes')
