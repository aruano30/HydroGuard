# HydroGuard 💧

Sistema de monitoreo y gestión de reportes de incidencias sobre fugas y problemas relacionados con el agua en la comunidad.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Angular, TypeScript, HTML5, CSS3.
- **Backend:** Node.js, Express / TypeScript (o Spring Boot según tu configuración).
- **Base de Datos:** MySQL (con tablas estructuradas para Usuarios, Incidencias, Categorías, Comentarios, Roles y Estados).

---

## 📂 Estructura del Repositorio

El proyecto utiliza un enfoque de monorepositorio con ramas organizadas para el control de versiones:
- **`main`**: Rama principal que contiene la versión estable y lista para la entrega final.
- **`developer`**: Rama de integración donde se unifican las características antes de pasar a producción.
- **`feature/backend`**: Rama aislada para el desarrollo de la lógica del servidor y controladores.
- **`feature/frontend`**: Rama aislada para las vistas, componentes y servicios de la interfaz de usuario.

---

## ⚙️ Configuración y Ejecución Local

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/aruano30/HydroGuard.git](https://github.com/aruano30/HydroGuard.git)
cd HydroGuard
```

### 2. Configurar la Base de Datos
- Importa el script de la base de datos en tu gestor MySQL (por ejemplo, MySQL Workbench).
- Verifica que las credenciales de conexión en el backend coincidan con tu entorno local.

### 3. Ejecutar el Backend
```bash
cd hydroguard-backend
npm install
npm run dev
```

### 4. Ejecutar el Frontend
```bash
cd ../hydroguard-frontend
npm install
ng serve
```
*Abre tu navegador e ingresa a `http://localhost:4200`.*

---

## 👥 Autor
- **Ariel Ruano**
