# Base de datos (dump)

La base de datos **NO está en este repositorio** porque contiene **datos reales
y sensibles de pacientes** (PII de salud). Subirlos a GitHub sería una fuga de
datos. Por eso `database/dump/*.sql` está en `.gitignore`.

## Cómo obtener el dump

Pídele a **Juan** el archivo `localhost.sql` (dump de MariaDB/MySQL de la base
`ipsupc_ips`) por un canal privado y colócalo **aquí**:

```
database/dump/localhost.sql
```

## Cómo se importa

El servicio `db` del `docker-compose.yml` monta esta carpeta en
`/docker-entrypoint-initdb.d`. En el **primer arranque** (volumen `dbdata`
vacío) MariaDB ejecuta automáticamente todos los `.sql` que encuentre aquí.

Si ya habías levantado la BD antes de colocar el dump, recréala:

```sh
docker compose down -v        # ⚠️ borra el volumen dbdata
docker compose up -d
```

El dump crea dos bases: `ipsupc_ips` (principal, ~66 tablas) e
`ipsupc_solicitudes`. **No modificamos su esquema ni sus datos**: el backend v2
solo mapea tablas existentes con Eloquent.
