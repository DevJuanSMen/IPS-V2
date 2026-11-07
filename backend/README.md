# IPS v2 — Backend (API Laravel)

API REST del sistema IPS v2, en **Laravel 13 / PHP 8.4**. Reemplaza el backend
legacy (Laravel 5.3) **conservando la base de datos intacta**: Eloquent mapea
las tablas existentes de `ipsupc_ips`; no se crean ni modifican tablas ni datos.

## Puesta en marcha (Docker)

El stack corre con Docker. Requiere que el stack legacy esté arriba (comparte su
contenedor de BD `ips_db`):

```sh
# 1) Stack legacy (levanta la BD ips_db)
docker compose -f "/home/chan/Proyecto de grado IPS/docker-compose.yml" up -d

# 2) Backend v2
docker compose -f "/home/chan/Proyecto de grado IPS/IPS-v2/docker-compose.yml" up -d
```

- API: http://localhost:8000
- BD: contenedor `ips_db` (MariaDB), base `ipsupc_ips` (vía red externa
  `proyectodegradoips_default`). Config en `.env` (`DB_HOST=ips_db`).

Comandos artisan dentro del contenedor:

```sh
docker exec ipsv2_backend sh -c 'cd /var/www/html && php artisan <cmd>'
```

## Autenticación — Sanctum SPA (cookie de sesión)

Elegida para **no tocar la BD** (sesiones en archivo, sin tabla de tokens).
El login es de **solo lectura** sobre la BD (no persiste `remember_token`).

Flujo que usa el frontend:

1. `GET  /sanctum/csrf-cookie` → cookie `XSRF-TOKEN`
2. `POST /api/login` `{ usuario, password }` → `{ user: { id, usuario, nombre, rol, estado, email, avatar } }`
3. `GET  /api/me` → usuario autenticado
4. `POST /api/logout`

El login usa el campo **`usuario`** (no email), verifica el hash **bcrypt** y
exige `estado = 'Activo'`. Roles del sistema: `Administrador`, `Admisionista`,
`Medico`, `Odontologo`, `Psicologo`, `PYP`, `Paciente`.

Config relevante (`.env`):

```
SESSION_DRIVER=file
SESSION_DOMAIN=localhost            # comparte cookie entre :5173 y :8000
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,localhost:8000
FRONTEND_URL=http://localhost:5173  # usado por config/cors.php (credentials)
```

`bootstrap/app.php` activa `$middleware->statefulApi()` para que las rutas
`/api` usen la sesión en los dominios stateful.

## Endpoints

| Método | Ruta                          | Auth | Descripción                          |
|--------|-------------------------------|------|--------------------------------------|
| POST   | `/api/login`                  | —    | Iniciar sesión                       |
| GET    | `/api/me`                     | sí   | Usuario autenticado                  |
| POST   | `/api/logout`                 | sí   | Cerrar sesión                        |
| GET    | `/api/catalogos/medicamentos` | sí   | Catálogo (search, page, per_page)    |
| GET    | `/api/catalogos/vacunas`      | sí   | Catálogo                             |
| GET    | `/api/catalogos/alergias`     | sí   | Catálogo                             |
| GET    | `/api/catalogos/examenes`     | sí   | Catálogo (nombre, codigo, tarifa)    |

Respuesta paginada uniforme:

```json
{ "data": [ ... ], "meta": { "current_page": 1, "last_page": 45, "per_page": 15, "total": 135 } }
```

## Cómo agregar un módulo

1. Crea el modelo en `app/Models/` con `protected $table = '<tabla_legacy>'`
   (la BD ya existe; no generes migraciones que la alteren).
2. Crea el controlador en `app/Http/Controllers/Api/` siguiendo el patrón de
   `CatalogoController` (búsqueda + paginación + forma `{ data, meta }`).
3. Registra la ruta en `routes/api.php` dentro del grupo `auth:sanctum`.

## Estructura clave

```
app/Models/                 User, Persona, Medicamento, Vacuna, Alergia, Examen
app/Http/Controllers/Api/   AuthController, CatalogoController
routes/api.php              Rutas de la API (prefijo /api)
config/cors.php             CORS con credenciales para la SPA
config/sanctum.php          Dominios stateful
bootstrap/app.php           statefulApi() + render JSON para api/*
```
