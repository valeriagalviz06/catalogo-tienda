# Catálogo de tienda

Aplicación para administrar productos y categorías, con una API NestJS y una interfaz React.

## Preparar la base de datos

1. Inicia MySQL Server y abre una conexión local en MySQL Workbench.
2. Abre `database/schema.sql` en Workbench y ejecuta el script. Crea la base `catalogo_tienda`, sus tablas y datos de ejemplo. Se puede ejecutar de nuevo sin duplicar categorías ni productos.
3. Configura `backend/.env` con las credenciales de tu conexión. Puedes partir de `backend/.env.example`; no subas el archivo `.env` real al repositorio.

El esquema debe ejecutarse antes de iniciar el backend. TypeORM usa `synchronize: false` y no modifica la estructura de la base.

## Iniciar el proyecto

En una terminal, inicia el backend:

```powershell
cd backend
npm.cmd install
npm.cmd run start:dev
```

En otra terminal, inicia la interfaz:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173`.