Instrucciones de despliegue en Vercel

Resumen
- Frontend: React (create-react-app) en `frontend`.
- Backend: Express + Prisma en `backend`, empaquetado como función serverless (`backend/api/index.ts`).

Variables de entorno necesarias en Vercel
- DATABASE_URL: URL de conexión a la base de datos (ej: mysql://user:pass@host:3306/dbname)
- NODE_ENV: production
- (Opcional) cualquier otra variable usada en `.env`

Pasos para desplegar en Vercel
1. Subir el repositorio a GitHub.
2. En Vercel, crear nuevo proyecto importando el repositorio.
3. Seleccionar el framework "Other" si es necesario. Vercel detectará `vercel.json`.
4. En la sección Environment Variables de Vercel, agregar `DATABASE_URL` y otras variables.
5. Desplegar. Vercel ejecutará el script de build especificado en `vercel.json`.

Comprobación local rápida
- En macOS (zsh):

  cd <repo-root>
  npm install
  npm run build

Esto ejecutará la build del frontend, instalará dependencias del backend, generará Prisma Client y compilará el backend.

Notas y limitaciones
- Asegúrate de que la base de datos sea accesible desde Vercel.
- Prisma migraciones pueden requerir pasos adicionales; ejecuta migraciones manualmente en el entorno de la base de datos si las necesitas.
- Si quieres usar un archivo .env local, asegúrate de no subirlo al repositorio.
\n### Pasos detallados en Vercel
1. En Vercel, crear un nuevo proyecto e importar el repositorio Git.
2. Durante la importación Vercel usará `vercel.json` y detectará dos builds: el frontend (static-build) y la función Node para `backend/api/index.ts`.
3. En Settings -> Environment Variables, agrega al menos:
  - `DATABASE_URL` = tu cadena de conexión (ej: mysql://user:pass@host:3306/dbname)
  - `NODE_ENV` = production
4. Opcional: si usas otra variable en `.env` (por ejemplo `PORT` o claves API), agrégalas también.
5. Desplegar y revisar los logs en el panel de Vercel para confirmar que `npm run build` en la raíz se ejecutó correctamente.

Rutas en tiempo de ejecución
- Las llamadas a la API deben apuntar a `/api/...`, por ejemplo `/api/products`.

Problemas comunes
- Si Prisma falla en tiempo de ejecución: asegúrate de que la base de datos sea accesible desde Vercel y que `DATABASE_URL` esté correctamente configurada.
- Si ves errores de compilación TS en la función Node, revisa que `backend/package.json` tenga `vercel-build` y que `serverless-http` esté instalado.

Soporte local
- Para probar localmente la compilación completa (frontend + backend):

```bash
npm install
npm run build
```

Esto compilará el frontend y luego construirá el backend y generará Prisma Client.

Si necesitas que lo despliegue yo (crear PR con cambios adicionales), dime y lo hago.
