import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

// Layout principal de la app autenticada: sidebar + topbar + contenido.
export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__main">
        <Topbar />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
