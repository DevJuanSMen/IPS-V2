# CLAUDE.md — Contexto del proyecto IPS v2

Este archivo le da a Claude Code el contexto necesario para trabajar en este
repositorio. Léelo completo antes de empezar.

---

## 1. Qué es esto

Proyecto de grado: **modernizar el sistema de una IPS** (Institución Prestadora
de Salud) de la universidad. El sistema maneja **citas** e **historias clínicas**
para varias áreas (medicina general, odontología, psicología, PYP).

- **Legacy:** Laravel 5.3 / PHP 5.6 (2017). No corre en PHP moderno. Es la
  referencia funcional, pero **no está en este repo**.
- **v2 (este repo):** backend nuevo en **Laravel 13 / PHP 8.4** (API REST) +
  frontend nuevo en **React + Vite (JavaScript)** (SPA).

### 🔒 Regla de oro: la base de datos NO se toca

Reutilizamos la base de datos existente **`ipsupc_ips`** tal cual. **No** se
crean, modifican ni eliminan tablas o columnas; **no** se escriben migraciones
que alteren el esquema. El backend solo **mapea tablas existentes con Eloquent**
(`protected $table = '...'`). Si necesitas datos, haz `SELECT`; evita cualquier
cosa que cambie el esquema.

### ⚠️ Datos sensibles (PII)

La BD contiene **datos reales de pacientes** (nombres, identificación, historias
clínicas). **Nunca** los subas a repos, logs públicos, ni los pegues en sitios
externos. El dump está gitignorado (`database/dump/*.sql`) a propósito.

---

## 2. Arquitectura

```
┌─────────────────────┐        HTTP + cookie de sesión        ┌──────────────────────┐
│  Frontend (React)   │  ───────────────────────────────────▶ │  Backend (Laravel 13) │
│  Vite · :5173       │  ◀─────────────────────────────────── │  API REST · :8000     │
└─────────────────────┘           JSON { data, meta }          └──────────┬───────────┘
                                                                           │ Eloquent (solo mapea)
                                                                ┌──────────▼───────────┐
                                                                │  MariaDB `ipsupc_ips` │
                                                                │  (intacta) · :3307    │
                                                                └───────────────────────┘
```

- Front y back son **proyectos separados** (API REST desacoplada).
- **Auth: Sanctum SPA basada en COOKIE de sesión** (no tokens). Se eligió así
  para **no crear tablas** en la BD (sesiones en archivo).

---

## 3. Cómo correr (resumen)

Ver [`README.md`](README.md) para el paso a paso completo. En corto:

```sh
docker compose up -d --build          # db + backend (:8000) + pma (:8082)
cp backend/.env.example backend/.env
docker exec ipsv2_backend sh -c 'cd /var/www/html && composer install && php artisan key:generate'
cd frontend && cp .env.example .env && npm install && npm run dev   # :5173
```

Requiere el **dump** en `database/dump/localhost.sql` (pídeselo a Juan).

Ejecutar artisan/composer: **siempre dentro del contenedor**
`docker exec ipsv2_backend sh -c 'cd /var/www/html && php artisan <cmd>'`
(en el host no hay PHP/Composer instalados).

---

## 4. Autenticación (cómo funciona)

Flujo del front contra el back:

1. `GET  /sanctum/csrf-cookie` → cookie `XSRF-TOKEN`
2. `POST /api/login` `{ usuario, password }` → `{ user: {...} }`
3. `GET  /api/me`
4. `POST /api/logout`

Detalles:
- Login por campo **`usuario`** (no email), hash **bcrypt**, exige
  `estado = 'Activo'`.
- `User` mapea la tabla `users`; `nombre` sale de la relación `persona`
  (tabla `personas`: `nombres` + `apellidos`).
- `axios` va con `withCredentials: true` + `withXSRFToken: true`.
- Config clave: `SESSION_DRIVER=file`, `SESSION_DOMAIN=localhost`,
  `SANCTUM_STATEFUL_DOMAINS` incluye `localhost:5173`, `config/cors.php` con
  `supports_credentials=true`. `bootstrap/app.php` usa `$middleware->statefulApi()`.

**Roles del sistema:** `Administrador`, `Admisionista`, `Administrativo`,
`Medico`, `Odontologo`, `Psicologo`, `PYP`, `Paciente`.
(El rol decide a qué panel entra el usuario.)

**Usuarios de prueba** (contraseña `ips123456`, dependen del dump privado):
Administrador=`Yumey`, Admisionista=`sandra`, Medico=`jorgejimenez`,
Odontologo=`Cesar29`, Psicologo=`49720822`, PYP=`jenny.mosquera`,
Paciente=`fabiocortez`.

---

## 5. Backend — convenciones

- **Modelos** (`backend/app/Models/`): cada uno fija `protected $table` a la
  tabla legacy. Ya existen: `User`, `Persona`, `Medicamento`, `Vacuna`,
  `Alergia`, `Examen`.
- **Controladores API** (`backend/app/Http/Controllers/Api/`): `AuthController`,
  `CatalogoController`.
- **Rutas:** `backend/routes/api.php` (prefijo `/api`). Público: `/login`. El
  resto bajo `Route::middleware('auth:sanctum')`.
- **Forma de respuesta de listados** (patrón a seguir):
  ```json
  { "data": [ ... ], "meta": { "current_page": 1, "last_page": 45, "per_page": 15, "total": 135 } }
  ```
  Soporta `?search=`, `?page=`, `?per_page=`. Ver `CatalogoController` como
  plantilla.

### Agregar un módulo (backend)
1. Crea el modelo en `app/Models/` con `protected $table = '<tabla_legacy>'`.
2. Crea el controlador en `app/Http/Controllers/Api/` copiando el patrón de
   `CatalogoController`.
3. Registra la ruta en `routes/api.php` dentro del grupo `auth:sanctum`.

Más detalle en [`backend/README.md`](backend/README.md).

---

## 6. Frontend — convenciones

- **Fuente de verdad de la navegación:** `frontend/src/config/navigation.js`.
  Define roles, home por rol y el **menú/módulos de cada rol**. El `router.jsx`
  **genera** las rutas desde ahí.
- **Rutas implementadas vs stubs:** en `frontend/src/router.jsx` hay un mapa
  `IMPLEMENTED` (path → componente real). Lo que no esté ahí se renderiza como
  `ModulePlaceholder` (stub). Para activar un módulo, implementa su pantalla y
  agrégala a `IMPLEMENTED`.
- **API:** `frontend/src/api/client.js` (axios con cookie) y
  `frontend/src/api/*.js` (funciones por recurso, p. ej. `catalogos.js`).
- **Componentes reutilizables:** `CatalogTable.jsx` (tabla con búsqueda +
  paginación servidor) es el patrón para listados.
- **Auth:** `src/auth/AuthContext.jsx` (`useAuth()`), `ProtectedRoute.jsx`
  (protege por sesión y por rol).
- **Modo demo (mock):** `VITE_USE_MOCK=true` en `frontend/.env` permite navegar
  toda la UI sin backend.

### Agregar una pantalla (frontend)
1. Crea el componente en `src/pages/...` (usa `CatalogTable` para listados).
2. Crea el fetcher en `src/api/...` usando `api` de `src/api/client.js`.
3. Conéctalo en `src/router.jsx` añadiendo su path al mapa `IMPLEMENTED`.

Más detalle en [`frontend/README.md`](frontend/README.md).

---

## 7. Mapa de roles y módulos (del sistema real)

Derivado del sistema legacy. Define la UI por rol (ver `navigation.js`):

- **Administrador:** horarios médicos, jornadas, médicos, citas, catálogos
  (vacunas, alergias, medicamentos, exámenes). ← catálogos YA implementados.
- **Admisionista:** registrar cita, registrar paciente, buscar paciente.
- **Administrativo:** agenda, historial, diagnósticos, estadísticas, reportes,
  usuarios, facultades, programas.
- **Medico:** citas, consultoría, historias clínicas, fórmulas, remisiones,
  recetados.
- **Odontologo:** citas, consultoría, odontograma, historias, plan de tratamiento.
- **Psicologo:** citas, psicoanálisis, historias.
- **PYP:** consultoría, historias.
- **Paciente:** apartar cita, mis citas, mi historia clínica.

---

## 8. Estado actual (qué está hecho y qué falta)

**Hecho:**
- Backend conectado a la BD intacta.
- Autenticación completa (login/logout/me) por cookie de sesión.
- Catálogos del Administrador con **datos reales** (search + paginación):
  medicamentos, vacunas, alergias, exámenes — backend (`CatalogoController`) y
  frontend (`src/pages/catalogos/`).

**Falta (stubs por implementar):** todo lo demás del mapa de la sección 7
(citas, historias clínicas por área, odontograma, estadísticas/reportes,
registro de pacientes, etc.). Cada uno aparece ya ruteado como
`ModulePlaceholder`; el trabajo es construir el endpoint + la pantalla
siguiendo los patrones de las secciones 5 y 6.

**Sugerencia de siguiente paso:** completar el panel de **Admisionista**
(registrar/buscar cita y paciente), que es el flujo central de la IPS.

---

## 9. Reglas rápidas para Claude

- **No** alteres el esquema de la BD ni escribas migraciones que la cambien.
- **No** subas datos de pacientes a ningún lado.
- Ejecuta PHP/Composer/artisan **dentro del contenedor** `ipsv2_backend`.
- Sigue los patrones existentes (`CatalogoController`, `CatalogTable`,
  `IMPLEMENTED`) en vez de inventar estructuras nuevas.
- Verifica los cambios de verdad (prueba el endpoint con `curl` autenticado y la
  pantalla en el navegador) antes de darlos por listos.
