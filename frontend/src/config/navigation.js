// -----------------------------------------------------------------------------
// Mapa de roles y módulos del sistema IPS v2.
//
// Esta estructura es la FUENTE DE VERDAD de la navegación: a partir de ella se
// generan el menú lateral (Sidebar) y las rutas protegidas (router.jsx).
// Cada módulo arranca como un "stub" (ModulePlaceholder); tu compañero solo
// tiene que reemplazar el componente de cada módulo por la pantalla real.
//
// Los roles y módulos corresponden al sistema legacy (Laravel 5.3):
//   Administrador, Admisionista, Administrativo, Medico, Odontologo,
//   Psicologo, PYP, Paciente.
// -----------------------------------------------------------------------------

// Roles tal como vienen del backend (campo `rol` / Gates '<Rol>-access').
export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  ADMISIONISTA: 'Admisionista',
  ADMINISTRATIVO: 'Administrativo',
  MEDICO: 'Medico',
  ODONTOLOGO: 'Odontologo',
  PSICOLOGO: 'Psicologo',
  PYP: 'PYP',
  PACIENTE: 'Paciente',
}

// Ruta "home" de cada rol (a dónde se le manda tras el login).
export const ROLE_HOME = {
  [ROLES.ADMINISTRADOR]: '/administrador',
  [ROLES.ADMISIONISTA]: '/admisionista',
  [ROLES.ADMINISTRATIVO]: '/administrativo',
  [ROLES.MEDICO]: '/medico',
  [ROLES.ODONTOLOGO]: '/odontologo',
  [ROLES.PSICOLOGO]: '/psicologo',
  [ROLES.PYP]: '/pyp',
  [ROLES.PACIENTE]: '/paciente',
}

// Menú por rol. Cada item: { label, path, icon, descripcion }
// `descripcion` se muestra en el stub para recordar qué hacía el módulo legacy.
export const NAVIGATION = {
  [ROLES.ADMINISTRADOR]: [
    { label: 'Inicio', path: '/administrador', icon: '🏠', descripcion: 'Panel principal del administrador.' },
    { label: 'Horarios médicos', path: '/administrador/horarios', icon: '🗓️', descripcion: 'Registrar y consultar horarios de atención de los médicos.' },
    { label: 'Jornadas', path: '/administrador/jornadas', icon: '⏰', descripcion: 'Gestión de jornadas y días de la semana.' },
    { label: 'Médicos', path: '/administrador/medicos', icon: '🩺', descripcion: 'Listado y gestión de médicos/especialistas.' },
    { label: 'Citas', path: '/administrador/citas', icon: '📋', descripcion: 'Ver todas las citas del sistema.' },
    { label: 'Vacunas', path: '/administrador/vacunas', icon: '💉', descripcion: 'Catálogo de vacunas.' },
    { label: 'Alergias', path: '/administrador/alergias', icon: '🤧', descripcion: 'Catálogo de alergias.' },
    { label: 'Medicamentos', path: '/administrador/medicamentos', icon: '💊', descripcion: 'Catálogo de medicamentos.' },
    { label: 'Exámenes', path: '/administrador/examenes', icon: '🧪', descripcion: 'Catálogo de exámenes.' },
  ],

  [ROLES.ADMISIONISTA]: [
    { label: 'Inicio', path: '/admisionista', icon: '🏠', descripcion: 'Panel principal del admisionista.' },
    { label: 'Registrar cita', path: '/admisionista/registrar-cita', icon: '➕', descripcion: 'Agendar una cita para un paciente (buscar horas disponibles, validar sanciones).' },
    { label: 'Registrar paciente', path: '/admisionista/registrar-usuario', icon: '🧑', descripcion: 'Registrar un nuevo usuario/paciente en el sistema.' },
    { label: 'Buscar paciente', path: '/admisionista/buscar-paciente', icon: '🔍', descripcion: 'Buscar pacientes por identificación.' },
  ],

  [ROLES.ADMINISTRATIVO]: [
    { label: 'Inicio', path: '/administrativo', icon: '🏠', descripcion: 'Panel principal administrativo.' },
    { label: 'Agenda de citas', path: '/administrativo/agenda', icon: '🗓️', descripcion: 'Agenda general de citas.' },
    { label: 'Historial de citas', path: '/administrativo/historial', icon: '📜', descripcion: 'Historial de citas atendidas.' },
    { label: 'Diagnósticos', path: '/administrativo/diagnosticos', icon: '🧾', descripcion: 'Consulta de diagnósticos.' },
    { label: 'Estadísticas', path: '/administrativo/estadisticas', icon: '📊', descripcion: 'Estadísticas por área, top 10 diagnósticos/exámenes/pacientes.' },
    { label: 'Reportes', path: '/administrativo/reportes', icon: '📑', descripcion: 'Reportes general, odontología, psicología, PYP (PDF/Excel).' },
    { label: 'Usuarios', path: '/administrativo/usuarios', icon: '👥', descripcion: 'Registro y modificación de usuarios del sistema.' },
    { label: 'Facultades', path: '/administrativo/facultades', icon: '🏫', descripcion: 'Gestión de facultades.' },
    { label: 'Programas', path: '/administrativo/programas', icon: '🎓', descripcion: 'Gestión de programas académicos.' },
  ],

  [ROLES.MEDICO]: [
    { label: 'Inicio', path: '/medico', icon: '🏠', descripcion: 'Panel principal del médico.' },
    { label: 'Mis citas', path: '/medico/citas', icon: '📋', descripcion: 'Citas asignadas al médico.' },
    { label: 'Consultoría', path: '/medico/consultoria', icon: '🩺', descripcion: 'Registrar la consulta/consultoría del paciente.' },
    { label: 'Historias clínicas', path: '/medico/historias', icon: '📁', descripcion: 'Consultar y registrar historias clínicas (antecedentes, examen físico, etc.).' },
    { label: 'Fórmulas', path: '/medico/formulas', icon: '💊', descripcion: 'Formular medicamentos y exámenes.' },
    { label: 'Remisiones', path: '/medico/remisiones', icon: '📨', descripcion: 'Registrar remisiones a especialistas.' },
    { label: 'Recetados', path: '/medico/recetados', icon: '📝', descripcion: 'Medicamentos y exámenes recetados.' },
  ],

  [ROLES.ODONTOLOGO]: [
    { label: 'Inicio', path: '/odontologo', icon: '🏠', descripcion: 'Panel principal del odontólogo.' },
    { label: 'Mis citas', path: '/odontologo/citas', icon: '📋', descripcion: 'Citas asignadas al odontólogo.' },
    { label: 'Consultoría', path: '/odontologo/consultoria', icon: '🦷', descripcion: 'Registrar la consulta odontológica.' },
    { label: 'Odontograma', path: '/odontologo/odontograma', icon: '🦷', descripcion: 'Odontograma: dientes y partes, observaciones.' },
    { label: 'Historias clínicas', path: '/odontologo/historias', icon: '📁', descripcion: 'Exámenes estomatológico, dental, periodontal, endodóntico.' },
    { label: 'Plan de tratamiento', path: '/odontologo/plan-tratamiento', icon: '📝', descripcion: 'Registrar el plan de tratamiento.' },
  ],

  [ROLES.PSICOLOGO]: [
    { label: 'Inicio', path: '/psicologo', icon: '🏠', descripcion: 'Panel principal del psicólogo.' },
    { label: 'Mis citas', path: '/psicologo/citas', icon: '📋', descripcion: 'Citas asignadas al psicólogo.' },
    { label: 'Psicoanálisis', path: '/psicologo/psicoanalisis', icon: '🧠', descripcion: 'Registrar el psicoanálisis del paciente.' },
    { label: 'Historias clínicas', path: '/psicologo/historias', icon: '📁', descripcion: 'Historias clínicas y diagnóstico psicológico.' },
  ],

  [ROLES.PYP]: [
    { label: 'Inicio', path: '/pyp', icon: '🏠', descripcion: 'Panel principal de Promoción y Prevención.' },
    { label: 'Consultoría', path: '/pyp/consultoria', icon: '🩺', descripcion: 'Registrar la consultoría de PYP.' },
    { label: 'Historias clínicas', path: '/pyp/historias', icon: '📁', descripcion: 'Historias clínicas y diagnóstico PYP.' },
  ],

  [ROLES.PACIENTE]: [
    { label: 'Inicio', path: '/paciente', icon: '🏠', descripcion: 'Panel principal del paciente.' },
    { label: 'Apartar cita', path: '/paciente/apartar-cita', icon: '➕', descripcion: 'Solicitar/apartar una cita según horarios disponibles.' },
    { label: 'Mis citas', path: '/paciente/historial-citas', icon: '📋', descripcion: 'Historial de citas del paciente.' },
    { label: 'Mi historia clínica', path: '/paciente/historia-clinica', icon: '📁', descripcion: 'Ver la historia clínica propia.' },
  ],
}

// Items comunes a todos los roles (van al final del menú).
export const COMMON_NAV = [
  { label: 'Mi perfil', path: '/perfil', icon: '⚙️', descripcion: 'Datos del perfil y cambio de contraseña/foto.' },
]

// Devuelve el menú de un rol (o vacío si el rol no existe).
export function navForRole(role) {
  return NAVIGATION[role] ?? []
}

// Devuelve la ruta home de un rol (fallback al dashboard genérico).
export function homeForRole(role) {
  return ROLE_HOME[role] ?? '/'
}
