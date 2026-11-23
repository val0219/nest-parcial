# Proyecto Base — Parcial Práctico Backend (NestJS + MongoDB)

API REST en NestJS y Mongoose para la gestión de **Usuarios (`/users`)** y **Tareas (`/tasks`)**.

---

## Requisitos Previos

- **Node.js** 18+ y **npm**
- **Docker Desktop** (o instancia local de MongoDB en el puerto `27017`)

---

## Instalación y Puesta en Marcha

1. **Levantar la base de datos MongoDB:**
   ```bash
   docker compose up -d
   ```
   *(Si utilizas una instancia local o MongoDB Atlas diferente a `mongodb://localhost:27017/nest-parcial`, configura la variable `MONGODB_URI` en un archivo `.env` tomando como base `.env.example`.)*

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación en modo desarrollo:**
   ```bash
   npm run start:dev
   ```
   El servidor quedará disponible en `http://localhost:3000`.

---

## Pruebas y Validación

- **Ejecutar pruebas unitarias:**
  ```bash
  npm test
  ```
- **Ejecutar pruebas end-to-end:**
  ```bash
  npm run test:e2e
  ```
- **Verificar compilación y linter:**
  ```bash
  npm run build
  npm run lint
  ```

---

## Endpoints del Sistema

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Público | Verificación básica del servidor |
| `POST` | `/users` | Público | Crear usuario (`name`, `email`) |
| `GET` | `/users` | Público | Listar usuarios registrados |
| `GET` | `/users/:id` | Público | Consultar usuario por ID |
| `GET` | `/tasks` | Público | Listar tareas registradas |
| `GET` | `/tasks/:id` | Público | Consultar tarea por ID |
| `POST` | `/tasks` | Restringido (`Authorization: admin-secret-token`) | Crear una tarea asociada a un usuario |

También puedes importar `nest-parcial.postman_collection.json` en Postman o utilizar `requests.http` con la extensión REST Client de VS Code para probar manualmente los endpoints.

## Evidencia de funcionamiento (Parcial 2 Segunda Parte)

Caso 1: Propiedades no autorizadas

Se creó un CreateTaskDto que solo acepta title, description, completed y userId. En main.ts se configuró el ValidationPipe global para que rechace cualquier propiedad que no esté en el DTO y el esquema de tareas quedó con strict en true para que Mongoose no guarde nada fuera del modelo.

Al enviar un POST /tasks con isAdmin, role e internalFlag, la API ahora responde 400 Bad Request con el mensaje: property isAdmin should not exist, property role should not exist, property internalFlag should not exist. La tarea no se guarda.

Si se envía la tarea solo con los campos permitidos, responde 201 Created y el documento queda guardado únicamente con title, completed, userId y las fechas.

Caso 2: Desacoplamiento entre módulos

El módulo de usuarios ahora exporta UsersService, y el módulo de tareas lo importa en vez de registrar el esquema de usuarios. Así, tareas ya no accede directamente a la colección de usuarios, sino que verifica que el usuario exista usando UsersService.

Al crear una tarea con un userId que no existe, la API responde 404 Not Found con el mensaje: Usuario con ID 600000000000000000000000 no encontrado.

Caso 3: Control de acceso con Guard

Se eliminó el middleware que bloqueaba todas las rutas de /tasks y se reemplazó por un AuthGuard que revisa la cabecera Authorization admin-secret-token. Si no es válida lanza un ForbiddenException, este guard solo se aplica al POST /tasks.

Ahora un GET /tasks sin cabeceras responde 200 OK con la lista de tareas, y GET /tasks/:id también es público. En cambio, un POST /tasks sin la cabecera Authorization responde 403 Forbidden con el mensaje Prohibido.

Caso 4: Controlador desacoplado de Mongoose

Se quitaron las inyecciones de TaskModel y UserModel del controlador de tareas, que ahora solo depende de TasksService. La lógica de crear una tarea (validar el usuario y guardarla) se movió a un método create dentro de TasksService y el endpoint POST /tasks solo recibe el DTO y le pasa la operación al servicio.

Para comprobarlo se agregó una prueba unitaria en tasks.controller.spec.ts que mockea únicamente TasksService. Al correr npm test, las pruebas pasan sin el error de dependencias que salía antes (Tests: 2 passed, 2 total).
