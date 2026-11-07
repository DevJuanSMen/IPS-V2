# IPS v2

Reconstrucción moderna del sistema de citas e historias clínicas de la IPS de la
universidad. Reemplaza el sistema legacy (**Laravel 5.3 / PHP 5.6**, de 2017) por
un stack nuevo, **conservando la base de datos intacta**:

- **Backend:** API REST en **Laravel 13 / PHP 8.4**.
- **Frontend:** SPA en **React + Vite (JavaScript)**.
- **Base de datos:** la misma `ipsupc_ips` del sistema viejo, **sin cambios de
  esquema ni datos** (Eloquent mapea las tablas existentes).

> ⚠️ **Datos sensibles:** la BD tiene información real de pacientes. El dump
> **no** está en el repo. Ver [`database/dump/README.md`](database/dump/README.md).

---

## Requisitos

- **Docker** + Docker Compose (para backend y base de datos).
- **Node.js 18+** (para el frontend).
- El **dump de la base de datos** (pídeselo a Juan; ver más abajo).

---

## Puesta en marcha (paso a paso)

### 1. Clonar y obtener el dump

```sh
git clone https://github.com/DevJuanSMen/IPS-V2.git
cd IPS-V2
```

Coloca el dump en `database/dump/localhost.sql` (ver
[`database/dump/README.md`](database/dump/README.md)).

### 2. Levantar backend + base de datos (Docker)

```sh
docker compose up -d --build
```

Esto arranca:
- `db` — MariaDB, importa el dump en el primer arranque (puerto host `3307`).
- `backend` — API Laravel en **http://localhost:8000**.
- `pma` — phpMyAdmin en **http://localhost:8082** (opcional).

### 3. Preparar el backend (primera vez)

```sh
# Instalar dependencias de PHP dentro del contenedor
docker exec ipsv2_backend sh -c 'cd /var/www/html && composer install'

# Crear el .env y la APP_KEY
cp backend/.env.example backend/.env
docker exec ipsv2_backend sh -c 'cd /var/www/html && php artisan key:generate'

# Permisos de storage/ (por si acaso)
docker exec ipsv2_backend sh -c 'chmod -R a+rwX /var/www/html/storage /var/www/html/bootstrap/cache'
```

Verifica que la API responde:

```sh
curl http://localhost:8000/up      # health check de Laravel
```

### 4. Levantar el frontend

```sh
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:8000/api, VITE_USE_MOCK=false
npm install
npm run dev              # http://localhost:5173
```

### 5. Entrar

Abre **http://localhost:5173** e inicia sesión. El login usa el campo
**`usuario`** (no email). Usuarios de prueba (contraseña `ips123456`): pídele a
Juan la lista (dependen del dump privado).

> **¿Sin backend todavía?** El frontend trae un **modo demo**: pon
> `VITE_USE_MOCK=true` en `frontend/.env` y navega toda la UI sin backend
> (login: cualquier usuario, contraseña = nombre del rol).

---

## Estructura del repo

```
IPS-v2/
├── backend/            API Laravel 13 (ver backend/README.md)
├── frontend/           SPA React + Vite (ver frontend/README.md)
├── docker/             Dockerfile del backend (PHP 8.4 + Apache)
├── database/dump/      Aquí va el dump (gitignorado, NO en el repo)
├── docker-compose.yml  db + backend + phpMyAdmin
├── CLAUDE.md           Contexto completo para trabajar con Claude Code
└── README.md           Este archivo
```

## Documentación

- **[CLAUDE.md](CLAUDE.md)** — contexto completo del proyecto (arquitectura,
  decisiones, qué está hecho y qué falta). Léelo primero si usas Claude Code.
- **[backend/README.md](backend/README.md)** — API, autenticación, endpoints,
  cómo agregar módulos.
- **[frontend/README.md](frontend/README.md)** — estructura, auth, módulos.

## Estado actual

| Área | Estado |
|------|--------|
| Backend conectado a la BD intacta | ✅ |
| Autenticación (login/logout/me, Sanctum SPA por cookie) | ✅ |
| Catálogos del Administrador (medicamentos, vacunas, alergias, exámenes) | ✅ pantallas reales |
| Resto de módulos (citas, historias clínicas, odontología, etc.) | ⏳ stubs, por implementar |
