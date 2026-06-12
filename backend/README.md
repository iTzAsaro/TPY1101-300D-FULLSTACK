# Backend - TPY1101 Full Stack Evaluation

## Descripción

Backend REST API desarrollado con Spring Boot para gestionar usuarios. Incluye operaciones CRUD completas y autenticación básica.

## Tecnologías Utilizadas

- **Framework**: Spring Boot 3.1.0
- **Lenguaje**: Java 17
- **Gestor de Dependencias**: Maven
- **ORM**: Spring Data JPA con Hibernate
- **Base de Datos**: PostgreSQL (se puede usar MySQL como alternativa)
- **Validación**: Jakarta Validation
- **Utilidades**: Lombok

## Requisitos Previos

- Java 17 o superior
- Maven 3.8 o superior
- PostgreSQL 12+ o MySQL 8.0+
- Git

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/iTzAsaro/TPY1101-300D-FULLSTACK.git
cd TPY1101-300D-FULLSTACK/backend
```

### 2. Instalar Dependencias

```bash
mvn clean install
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL

1. Crear la base de datos:
```sql
CREATE DATABASE tpy1101;
```

2. Actualizar `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tpy1101
spring.datasource.username=postgres
spring.datasource.password=tu_contraseña
```

#### Opción B: MySQL

1. Crear la base de datos:
```sql
CREATE DATABASE tpy1101;
```

2. Actualizar `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tpy1101
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

## Ejecución

### Ejecutar con Maven

```bash
mvn spring-boot:run
```

### Ejecutar desde IDE

1. Abrir el proyecto en IntelliJ IDEA o Eclipse
2. Ejecutar la clase `FullStackApplication.java`

El servidor estará disponible en: `http://localhost:8080/api`

## Endpoints de la API

### Gestión de Usuarios

#### Crear Usuario
- **Método**: `POST`
- **Ruta**: `/api/usuarios`
- **Body**:
```json
{
  "email": "usuario@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "contrasena": "password123"
}
```

#### Obtener Todos los Usuarios
- **Método**: `GET`
- **Ruta**: `/api/usuarios`

#### Obtener Usuarios Activos
- **Método**: `GET`
- **Ruta**: `/api/usuarios/activos`

#### Obtener Usuario por ID
- **Método**: `GET`
- **Ruta**: `/api/usuarios/{id}`

#### Obtener Usuario por Email
- **Método**: `GET`
- **Ruta**: `/api/usuarios/email/{email}`

#### Actualizar Usuario
- **Método**: `PUT`
- **Ruta**: `/api/usuarios/{id}`
- **Body**:
```json
{
  "email": "nuevo@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "contrasena": "newpassword123"
}
```

#### Eliminar Usuario (Soft Delete)
- **Método**: `DELETE`
- **Ruta**: `/api/usuarios/{id}`

#### Eliminar Usuario Permanentemente
- **Método**: `DELETE`
- **Ruta**: `/api/usuarios/permanente/{id}`

## Estructura del Proyecto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/tpy1101/
│   │   │   ├── controller/
│   │   │   │   └── UsuarioController.java
│   │   │   ├── service/
│   │   │   │   └── UsuarioService.java
│   │   │   ├── repository/
│   │   │   │   └── UsuarioRepository.java
│   │   │   ├── entity/
│   │   │   │   └── Usuario.java
│   │   │   ├── dto/
│   │   │   │   └── UsuarioDTO.java
│   │   │   ├── exception/
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── FullStackApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Credenciales de Prueba

### Usuario Administrador
```
Email: admin@tpy1101.com
Nombre: Admin
Apellido: TPY1101
Contraseña: admin123
```

### Usuario Regular
```
Email: usuario@tpy1101.com
Nombre: Usuario
Apellido: Prueba
Contraseña: usuario123
```

## Puertos Utilizados

- **Backend**: `8080`
- **Base de Datos PostgreSQL**: `5432`
- **Base de Datos MySQL**: `3306`

## Dependencias Principales

| Dependencia | Versión | Propósito |
|---|---|---|
| spring-boot-starter-web | 3.1.0 | Web y REST API |
| spring-boot-starter-data-jpa | 3.1.0 | ORM y persistencia |
| postgresql | 42.6.0 | Driver PostgreSQL |
| mysql-connector-java | 8.0.33 | Driver MySQL |
| lombok | 1.18.30 | Reducción de boilerplate |
| spring-boot-starter-validation | 3.1.0 | Validación de datos |

## Script de Creación de Tablas

Las tablas se crean automáticamente con `spring.jpa.hibernate.ddl-auto=update`. 

Tabla principal creada:

```sql
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  fecha_actualizacion TIMESTAMP,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);
```

## Integración con Frontend

El backend permite conexiones desde `http://localhost:3000` (configurado en CORS).

Ejemplo de solicitud desde React:

```javascript
const response = await fetch('http://localhost:8080/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@example.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    contrasena: 'password123'
  })
});
```

## Consideraciones de Seguridad

⚠️ **Importante**: Este código es para fines educativos. Para producción:

1. Hashear contraseñas (usar BCrypt)
2. Implementar JWT para autenticación
3. Añadir autorización basada en roles
4. Validar y sanitizar todas las entradas
5. Usar HTTPS
6. Implementar rate limiting
7. Añadir logs de auditoría

## Troubleshooting

### Error de conexión a base de datos
- Verificar que la BD está ejecutándose
- Verificar credenciales en `application.properties`
- Verificar que la BD existe

### Error de puertos en uso
- Cambiar puerto en `application.properties`: `server.port=8090`

### Errores de validación
- Verificar que los datos cumplan con las reglas de validación
- Revisar los mensajes de error retornados

## Contribuyentes

- iTzAsaro
- Yael

## Fecha de Creación

Junio 2026

---

**Estado**: En desarrollo ✅