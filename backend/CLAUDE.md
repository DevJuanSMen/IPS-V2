# Backend (Laravel 13) — notas para Claude

El contexto completo del proyecto está en el **[`CLAUDE.md` de la raíz](../CLAUDE.md)**.
Léelo primero. Resumen de lo específico del backend:

- **No instales Laravel Boost ni alteres la base de datos.** La BD `ipsupc_ips`
  se conserva intacta: los modelos solo **mapean** tablas existentes
  (`protected $table = '...'`). No generes migraciones que cambien el esquema.
- **PHP/Composer/artisan corren dentro del contenedor:**
  `docker exec ipsv2_backend sh -c 'cd /var/www/html && php artisan <cmd>'`
  (en el host no hay PHP ni Composer).
- **Auth:** Sanctum SPA por cookie de sesión. Ver `AuthController`,
  `routes/api.php`, `config/cors.php`, `config/sanctum.php` y `bootstrap/app.php`.
- **Patrón de módulos:** copia `CatalogoController` (búsqueda + paginación +
  respuesta `{ data, meta }`). Registra la ruta en el grupo `auth:sanctum`.

Detalle de endpoints y setup: [`README.md`](README.md).
