# Red Social · Frontend

Aplicación web desarrollada en equipo para crear perfiles, publicar contenido y participar mediante comentarios y etiquetas. Este repositorio contiene la interfaz construida con React; consume una API REST desarrollada con Node.js, Express y MongoDB.

El proyecto fue realizado en la Universidad Nacional de Hurlingham (UNAHUR) para integrar conocimientos de construcción de interfaces y estrategias de persistencia en una aplicación full stack.

## Funcionalidades principales

- Registro e inicio de sesión.
- Visualización y edición de perfiles.
- Creación, edición y eliminación de publicaciones.
- Asociación de imágenes y etiquetas a las publicaciones.
- Comentarios e interacción entre usuarios.
- Navegación SPA con rutas de React.
- Interfaz responsive construida con React Bootstrap.
- Integración con una API REST y persistencia en MongoDB.

## Tecnologías

| Área | Tecnología |
| --- | --- |
| Interfaz | React 19 |
| Build | Vite 6 |
| Navegación | React Router 7 |
| Componentes y estilos | React Bootstrap + Bootstrap 5 |
| Backend relacionado | Node.js + Express |
| Base de datos | MongoDB + Mongoose |
| Documentación de API | Swagger / OpenAPI |
| Entorno | Docker |

## Arquitectura

La solución se divide en dos aplicaciones:

- **Frontend:** este repositorio, responsable de las vistas, navegación, formularios, estado de sesión e integración HTTP.
- **Backend:** [anti-social-mongo-4-bits](https://github.com/gabrielledezma21/anti-social-mongo-4-bits), API REST responsable de las reglas de negocio, validaciones y persistencia.

El frontend centraliza la URL de la API mediante variables de entorno. Las operaciones relacionadas con usuarios, publicaciones, comentarios y etiquetas se realizan a través de funciones de acceso a datos separadas de las vistas.

## Estructura principal

```text
src/
├── assets/                  # Recursos estáticos
├── components/
│   ├── functions/          # Integración con la API
│   ├── home/               # Componentes del inicio y publicaciones
│   ├── profile/            # Componentes de perfiles
│   └── FormLogin-components/
├── config/                  # Configuración de la API
├── context/                 # Estado compartido
└── pages/                   # Vistas principales
```

## Ejecución local

### Requisitos

- Node.js.
- npm.
- Backend de la red social en ejecución.

### Instalación

```bash
git clone https://github.com/gabrielledezma21/red-social-frontend.git
cd red-social-frontend
npm install
```

Crear un archivo `.env`:

```env
VITE_API_URL=http://localhost
VITE_API_PORT=3001
```

Iniciar el frontend:

```bash
npm run dev
```

La aplicación queda disponible normalmente en:

```text
http://localhost:5173
```

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Previsualiza el build generado |

## Despliegue

El proyecto incluye una configuración para Vercel que permite resolver correctamente las rutas internas de la SPA al recargar el navegador.

En producción se deben configurar `VITE_API_URL` y `VITE_API_PORT` de acuerdo con la dirección pública del backend.

## Trabajo en equipo

El proyecto fue construido por un equipo de cuatro integrantes utilizando Git, ramas e integración de cambios entre frontend y backend.

### Integrantes

- Víctor Gonzalvez Chala.
- Gabriel Ledezma.
- Lucas Santana.
- Hernán Viltez.

## Aprendizajes principales

- Integración de una SPA con una API REST.
- Separación de componentes, páginas, contexto y acceso a datos.
- Modelado de publicaciones, comentarios, imágenes y etiquetas.
- Coordinación de contratos entre frontend y backend.
- Resolución de conflictos e integración de cambios con Git.
- Despliegue de una aplicación full stack.

## Contexto académico

- **Universidad:** Universidad Nacional de Hurlingham.
- **Materias:** Construcción de Interfaces y Estrategias de Persistencia.
- **Año:** 2025.

## Autoría

Proyecto grupal desarrollado en UNAHUR. Este repositorio es mantenido en la cuenta de [Gabriel Ledezma](https://github.com/gabrielledezma21).
