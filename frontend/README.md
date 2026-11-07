# IPS v2 — Frontend (base)

Front **base** del sistema IPS v2, construido con **Vite + React (JavaScript)**.
Consume el backend **Laravel** como **API REST** (proyecto hermano en `../backend`).

Esta es una **base para continuar**: incluye autenticación, layout, navegación por
rol y **todas las pantallas del sistema ya ruteadas como _stubs_**. El trabajo
pendiente es reemplazar cada stub por la pantalla real.

## Requisitos

- Node.js 18+ (hay Node 26 instalado en la máquina de desarrollo).

## Puesta en marcha

```sh
cd IPS-v2/frontend
cp .env.example .env     # ajusta VITE_API_URL / VITE_USE_MOCK si hace falta
npm install
npm run dev              # http://localhost:5173
```

### Modo demo (sin backend)

Por defecto `VITE_USE_MOCK=true`: el front funciona **sin backend**, con login y
usuario simulados, para poder navegar toda la UI de inmediato.

En la pantalla de login, escribe **cualquier usuario** y usa como **contraseña el
nombre del rol** que quieras explorar:

`Administrador`, `Admisionista`, `Administrativo`, `Medico`, `Odontologo`,
`Psicologo`, `PYP`, `Paciente`.

Cuando el backend ya responda, pon `VITE_USE_MOCK=false` en tu `.env`.

## Estructura

```
src/
  api/
    client.js         Instancia de axios (baseURL, token Bearer, interceptor 401).
    auth.js           login / logout / usuario actual (con modo mock y modo real).
  auth/
    AuthContext.jsx   Estado global de sesión (useAuth()).
    ProtectedRoute.jsx Protege rutas por sesión y por rol.
  components/
    Layout.jsx        Sidebar + Topbar + contenido.
    Sidebar.jsx       Menú lateral generado según el rol.
    Topbar.jsx        Barra superior con usuario y cerrar sesión.
  config/
    navigation.js     ⭐ FUENTE DE VERDAD: roles, home por rol y menú/módulos.
  pages/
    Login.jsx         Pantalla de login (funcional).
    Dashboard.jsx     Inicio de cada rol (accesos directos a sus módulos).
    Perfil.jsx        Perfil del usuario.
    ModulePlaceholder.jsx  Stub genérico de módulo pendiente.
    NotFound.jsx      404.
  router.jsx          Genera las rutas a partir de config/navigation.js.
  App.jsx             BrowserRouter + AuthProvider + router.
  main.jsx            Punto de entrada.
  index.css           Estilos.
```

## Cómo implementar un módulo

1. Crea tu componente en `src/pages/`, p. ej. `admisionista/RegistrarCita.jsx`.
2. Usa el cliente `api` para llamar al backend:
   ```js
   import { api } from '../../api/client'
   const { data } = await api.get('/citas')
   ```
3. En `src/router.jsx`, reemplaza el `<ModulePlaceholder/>` de esa ruta por tu
   componente.
4. ¿Nuevo módulo en el menú? Agrégalo en `src/config/navigation.js` y su ruta
   (como stub) se crea sola.

## Autenticación (ya conectada al backend)

Usa **Sanctum SPA por cookie de sesión** (no tokens). El flujo, encapsulado en
`src/api/auth.js` + `src/api/client.js`:

1. `GET  /sanctum/csrf-cookie`  (axios guarda `XSRF-TOKEN`)
2. `POST /api/login` `{ usuario, password }` → `{ user }`
3. `GET  /api/me`
4. `POST /api/logout`

`axios` va con `withCredentials: true` y `withXSRFToken: true` para enviar la
cookie de sesión y el header `X-XSRF-TOKEN`.

| Método | Ruta                          | Respuesta                                   |
|--------|-------------------------------|---------------------------------------------|
| POST   | `/api/login`                  | `{ user: { id, usuario, nombre, rol, ... } }` |
| GET    | `/api/me`                     | `{ user }`                                  |
| POST   | `/api/logout`                 | `{ message }`                               |
| GET    | `/api/catalogos/{catalogo}`   | `{ data, meta }` (paginado)                 |

El login usa el campo **`usuario`** (no email) y el `rol` decide a qué panel
entra. Roles: `Administrador`, `Admisionista`, `Administrativo`, `Medico`,
`Odontologo`, `Psicologo`, `PYP`, `Paciente`.

### Módulos ya implementados (pantallas reales)

Catálogos del Administrador (datos reales con búsqueda y paginación):
**Medicamentos, Vacunas, Alergias, Exámenes**. Ver `src/pages/catalogos/` y el
componente reutilizable `src/components/CatalogTable.jsx`. El resto del menú
sigue como stub hasta implementarse (ver `IMPLEMENTED` en `src/router.jsx`).
