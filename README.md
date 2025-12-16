# Gestión de usuarios

Proyecto full-stack con dos implementaciones de backend (TypeScript y Python) + frontend en React + Vite. Incluye autenticación JWT, control de roles (admin y operario) y despliegue vía Docker Compose.

## Backend TypeScript (Express + Prisma)
1. Copia variables: `cp back_ts/.env.example back_ts/.env` y ajusta `DATABASE_URL`, `JWT_SECRET` y credenciales del admin seed (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`).
2. Instala dependencias: `cd back_ts && pnpm install`.
3. Ejecuta migraciones: `npx prisma migrate dev --name init` (o `npx prisma db push`).
4. Levanta el servidor: `pnpm run dev` (puerto por defecto 4000).
5. El primer arranque crea automáticamente un usuario admin con las credenciales del `.env` si no existe.

## Backend Python (FastAPI + SQLAlchemy)
1. Copia variables: `cp back_py/.env.example back_py/.env` y ajusta `DATABASE_URL`, `JWT_SECRET` y credenciales del admin seed (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`).
2. Crea entorno virtual: `python -m venv venv`.
3. Activa el entorno: 
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Instala dependencias: `cd back_py && pip install -r requirements.txt`.
5. Levanta el servidor: `uvicorn main:app --reload` (puerto por defecto 8000).
6. El primer arranque crea automáticamente un usuario admin con las credenciales del `.env` si no existe.

Endpoints principales:
- `POST /api/auth/login` → login y entrega de token JWT.
- `GET /api/users` → lista de usuarios (solo admin).
- `POST /api/users` → crea usuario con rol (solo admin).
- `PATCH /api/users/:id/role` → cambia rol (solo admin).

## Frontend (React + Vite)
1. Configura API: `cp frond/.env.example frond/.env` y ajusta `VITE_API_URL` (por defecto http://localhost:4000).
2. Instala dependencias: `cd frond && npm install`.
3. Ejecuta: `npm run dev` (puerto 5173).

### Demo desplegado
- Login: https://prueba-tecnica-front.onrender.com/

Flujo:
- Inicia sesión con el admin semilla.
- Como admin puedes crear usuarios y asignarles rol.
- Como operario solo ves el panel restringido.

## Docker Compose
1. Desde `Prueba_tecnica_ts`: `docker compose up --build`.
2. Servicios: `db` (PostgreSQL), `api` (puerto 4000), `web` (puerto 5173). El frontend se comunica con la API usando `http://api:4000` dentro de la red de Docker.

## Buenas prácticas incluidas
- TypeScript end-to-end.
- Prisma como ORM y validaciones con Zod.
- JWT + middlewares de autenticación/autorización.
- React Query para datos y protección de rutas en frontend.
- ESLint + Prettier en ambos paquetes.

## Siguientes pasos sugeridos
- Agregar tests (Jest/supertest en API, Vitest/RTL en frontend).
- Manejo de refresco de tokens y expiración.
- Despliegue CI/CD con pipelines y secrets seguros.
