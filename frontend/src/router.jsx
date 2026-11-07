import { Routes, Route, Navigate } from 'react-router-dom'
import { ROLES, ROLE_HOME, navForRole, homeForRole } from './config/navigation'
import { useAuth } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'
import NotFound from './pages/NotFound'
import ModulePlaceholder from './pages/ModulePlaceholder'
import Medicamentos from './pages/catalogos/Medicamentos'
import Vacunas from './pages/catalogos/Vacunas'
import Alergias from './pages/catalogos/Alergias'
import Examenes from './pages/catalogos/Examenes'

// Módulos YA implementados (pantallas reales). El resto de rutas del menú se
// renderizan como stub (ModulePlaceholder) hasta que se implementen. Para
// activar un módulo, añade su path aquí con su componente.
const IMPLEMENTED = {
  '/administrador/medicamentos': <Medicamentos />,
  '/administrador/vacunas': <Vacunas />,
  '/administrador/alergias': <Alergias />,
  '/administrador/examenes': <Examenes />,
}

// Redirección de "/": al home del rol si hay sesión, si no al login.
function RootRedirect() {
  const { isAuthenticated, user } = useAuth()
  return <Navigate to={isAuthenticated ? homeForRole(user.rol) : '/login'} replace />
}

// Las rutas se GENERAN a partir de config/navigation.js: así, agregar un módulo
// al menú crea automáticamente su ruta (como stub). Para implementar un módulo,
// reemplaza <ModulePlaceholder/> por tu componente real aquí abajo.
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas comunes a cualquier usuario autenticado (sin restricción de rol) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Un grupo de rutas protegidas por cada rol */}
      {Object.values(ROLES).map((role) => (
        <Route
          key={role}
          element={
            <ProtectedRoute roles={[role]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {navForRole(role).map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                item.path === ROLE_HOME[role] ? (
                  <Dashboard />
                ) : (
                  IMPLEMENTED[item.path] ?? (
                    <ModulePlaceholder titulo={item.label} descripcion={item.descripcion} />
                  )
                )
              }
            />
          ))}
        </Route>
      ))}

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
