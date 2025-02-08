# Star Wars Movies API

## 🚀 **Tecnologías Usadas**

- **NestJS** (Framework para Node.js)
- **TypeScript**
- **JWT** (Json Web Token) para autenticación
- **Google OAuth2** para login con Google
- **TypeORM** (ORM para manejar la base de datos)
- **MySQL**
- **Docker**
- **Swagger** (Documentación interactiva de la API)
- **Jest** (Testing)

## 📂 **Requisitos**

- **Docker** y **Docker Compose** instalados.
- **Cuenta en Google Cloud** para configurar OAuth.
- **Git** para clonar el repositorio.

## 📦 **Instalación y Configuración**

1️⃣ **Clonar el repositorio:**

```sh
git clone https://github.com/AyeVillarruel/star-wars-movies.git
cd star-wars-movies
```

2️⃣ **Configurar variables de entorno:**
Crea un archivo **.env** en la raíz del proyecto y define las siguientes variables:

```ini
DATABASE_HOST=mysql_dev
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=star_wars_movies
JWT_SECRET=tu_secreto_aqui
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

 Configurar variables de entorno:
Crea un archivo .env en la raíz del proyecto y define las siguientes variables:

DATABASE_HOST=mysql_dev
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=star_wars_movies
JWT_SECRET=tu_secreto_aqui
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

 ***Cómo Obtener un JWT_SECRET Seguro***

Puedes generar una clave secreta segura ejecutando el siguiente comando en tu terminal:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Luego, copia el resultado y agrégalo en tu archivo .env:
```sh
JWT_SECRET=clave_generada_aqui
```

 ***Obtener Credenciales de Google OAuth***

1️⃣ Crear un proyecto en Google Cloud

Ve a Google Cloud Console

Crea un nuevo proyecto o usa uno existente.

2️⃣ Habilitar la API de OAuth

Ve a APIs y Servicios → Credenciales.

Crea una Credencial OAuth 2.0.

En Tipo de Aplicación, selecciona Aplicación Web.

3️⃣ Configurar los orígenes y redirecciones

Orígenes autorizados: http://localhost:3000

URI de redirección: http://localhost:3000/auth/google/callback

4️⃣ Obtener Client ID y Secret

Copia el CLIENT_ID y CLIENT_SECRET generados.

Agrégalos en el archivo .env:

```sh
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```
3️⃣ **Levantar la API con Docker:**

```sh
docker-compose up --build -d
```

Esto iniciará la API y la base de datos dentro de contenedores Docker.

4️⃣ **Verificar que el contenedor esté corriendo:**

```sh
docker ps
```

Si el contenedor `nestjs_app` no aparece en la lista, verifica los logs con:

```sh
docker logs nestjs_app
```

5️⃣ **Entrar al contenedor de Docker:**

```sh
docker exec -it nestjs_app bash
```

6️⃣ **Instalar las dependencias dentro del contenedor:**

```sh
npm install
```

7️⃣ **Iniciar el servidor dentro del contenedor:**

```sh
npm run start:dev
```

8️⃣ **Acceder a la API:**

- **Swagger UI:** [`http://localhost:3000/api/docs`](http://localhost:3000/api/docs)
- **Base de datos (si usas Workbench o Adminer):** Conéctate a `localhost:3306` con usuario `root` y contraseña `root`.

## 🔑 **Autenticación**

La API usa autenticación con **JWT** y **Google OAuth2**.

### **🔹Registro**

📌 **Endpoint:** `POST /users`
📌 **Roles disponibles:** `ADMIN`, `REGULAR`.

```json
{
  "email": "user@example.com",
  "password": "Contraseña123!",
  "role": "REGULAR"
}
```

✅ **Respuesta:**

```json
{
  "email": "user@example.com",
  "password": "$2b$10$3nU4zxQoAj9lItIMG6hLvuDTYXYpmRZzr9CgSNuxyZKMcr/QhwKD.",
  "role": "REGULAR",
  "id": 10
}
```


### **🔹 Login con Email y Contraseña**

📌 **Endpoint:** `POST /auth/login`

```json
{
  "email": "usuario@example.com",
  "password": "Contraseña123!"
}
```

✅ **Respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
📌  ***Usar el token en Swagger:***
1️⃣ Copia el access_token obtenido en el login.
2️⃣ Ve a Swagger UI en http://localhost:3000/api/docs.
3️⃣ En la parte superior derecha, haz clic en Authorize.
4️⃣ Pega el token en el formato Bearer <access_token>.
5️⃣ Confirma y ahora podrás probar los endpoints protegidos.


### **🔹 Login con Google OAuth**

⚠️ **IMPORTANTE:** Swagger **no permite la redirección a Google**, por lo que este login **debe hacerse desde un navegador**.

📌 **Pasos para autenticarse con Google:**
1️⃣ Acceder a `http://localhost:3000/auth/google` en tu navegador.
2️⃣ Google pedirá acceso y redirigirá a `http://localhost:3000/auth/google/callback`.
3️⃣ En la respuesta recibirás el **token JWT**.


## 🎬 **Manejo de Películas**

📌 **Obtener todas las películas:**

```
GET /movies
```

📌 **Agregar una película (solo ADMIN):**

```
POST /movies
```

```json
{
  "title": "A New Hope",
  "description": "La primera película de Star Wars",
  "releaseDate": "1977-05-25",
  "director": "George Lucas"
}
```

📌 **Editar una película (solo ADMIN):**

```
PUT /movies/:id
```

📌 **Eliminar una película (solo ADMIN):**

```
DELETE /movies/:id
```

## 🎥 **Favoritos**

📌 **Agregar una película a favoritos:**

```
POST /movies/favorites/:movieId
```

📌 **Eliminar una película de favoritos:**

```
DELETE /movies/favorites/:movieId
```

📌 **Ver tus películas favoritas:**

```
GET /movies/user/favorites
```

## 👥 **Gestión de Usuarios**

📌 **Obtener todos los usuarios:**

```
GET /users
```

📌 **Obtener usuario por email (ADMIN y REGULAR pueden acceder):**

```
GET /users/:email
```

## ✅ **Testing**

La API tiene tests automatizados con Jest.
Para ejecutarlos dentro del contenedor de Docker:

```sh
docker exec -it nestjs_app npm run test
```

Si ya estas dentro del contenedor de Docker simplemente ejecuta

```sh
 npm run test
```