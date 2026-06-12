# TPY1101 - Frontend Full Stack

Frontend en React 18+ para la aplicación de Administración de Usuarios TPY1101-300D.

## 🚀 Características Implementadas

### ✅ Autenticación
- Login seguro con email y contraseña
- Validación de credenciales
- Manejo de tokens JWT
- Logout automático
- Interceptores de Axios

### ✅ Gestión de Usuarios (CRUD)
- Listar todos los usuarios en tabla interactiva
- Ver detalles de usuario
- Crear nuevo usuario con validación
- Editar usuario existente
- Eliminar usuario con modal de confirmación

### ✅ Seguridad
- Protección de rutas autenticadas
- Control de acceso basado en autenticación
- Almacenamiento seguro de tokens
- Redirección automática a login

### ✅ Interfaz de Usuario
- Diseño moderno y limpio
- Responsive (mobile, tablet, desktop)
- Indicadores de carga
- Mensajes de éxito/error
- Modal de confirmación elegante
- Animaciones suaves

## 📦 Tecnologías Utilizadas

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "tailwindcss": "^3.x",
  "vite": "^4.x"
}
```

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── Alert.jsx              # Alertas de éxito/error
│   ├── AppHeader.jsx          # Encabezado con usuario
│   ├── ConfirmDeleteModal.jsx # Modal de confirmación
│   ├── DashboardCard.jsx      # Tarjeta de estadísticas
│   ├── LoginForm.jsx          # Formulario de login
│   ├── ProtectedRoute.jsx     # Protección de rutas
│   ├── UsuarioForm.jsx        # Crear/editar usuario
│   └── UsuarioList.jsx        # Listado de usuarios
├── context/
│   └── AuthContext.jsx        # Context de autenticación
├── services/
│   └── api.js                 # Configuración de Axios
├── App.jsx                    # Rutas con React Router v6
├── main.jsx                   # Punto de entrada
└── index.css                  # Estilos globales

Configuración:
├── index.html                 # HTML principal
├── vite.config.js             # Configuración Vite
├── tailwind.config.js         # Configuración Tailwind
├── postcss.config.js          # Configuración PostCSS
└── package.json               # Dependencias
```

## 🛠️ Instalación

### Requisitos Previos
- Node.js 16+
- npm 8+
- Backend corriendo en http://localhost:8080

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/iTzAsaro/TPY1101-300D-FULLSTACK.git
cd TPY1101-300D-FULLSTACK

# 2. Cambiar a rama de desarrollo
git checkout alex/yael

# 3. Instalar dependencias
npm install

# 4. Iniciar en desarrollo
npm run dev

# 5. Compilar para producción
npm run build
```

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```
Disponible en: http://localhost:5173

### Producción
```bash
npm run build
npm run preview
```

## 🔐 Credenciales Demo

```
Email: admin@tpy1101.cl
Contraseña: 123456
```

## 📋 Endpoints de API Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

## 🎨 Componentes Principales

### LoginForm.jsx
```jsx
- Validación de email y contraseña
- Manejo de errores
- Redirección al dashboard
```

### UsuarioList.jsx
```jsx
- Tabla con búsqueda
- Botones de editar/eliminar
- Estadísticas
- Modal de confirmación
```

### UsuarioForm.jsx
```jsx
- Modo creación y edición
- Validación de campos
- Pre-rellenado en edición
- Manejo de errores
```

### ProtectedRoute.jsx
```jsx
- Verifica autenticación
- Redirige a login si no autenticado
- Indicador de carga
```

## 📊 Flujo de Autenticación

1. Usuario ingresa credenciales en LoginForm
2. AuthContext realiza solicitud POST a `/api/auth/login`
3. Servidor retorna token JWT
4. Token se guarda en localStorage
5. Usuario es redirigido al dashboard
6. Rutas protegidas verifican autenticación
7. Axios interceptor añade token a cada solicitud
8. Si 401, se limpia token y redirige a login

## ✅ Validación de Formularios

```javascript
Email:
  - Requerido
  - Formato válido (contiene @)
  - No repetido (en creación)

Nombre/Apellido:
  - Requerido
  - Mínimo 2 caracteres

Contraseña:
  - Requerido en creación
  - Mínimo 6 caracteres
  - Opcional en edición

Estado:
  - Activo o Inactivo
  - Requerido
```

## 🔍 Manejo de Errores

```javascript
- 400: Bad Request → Validación fallida
- 401: Unauthorized → Token inválido/expirado
- 404: Not Found → Recurso no existe
- 500: Server Error → Error del servidor
```

## 🎯 Casos de Uso

### 1. Login
1. Ingresar email y contraseña
2. Click en "Iniciar Sesión"
3. Validación en cliente
4. Solicitud al backend
5. Redirección al dashboard

### 2. Ver Usuarios
1. Acceder a dashboard
2. Ver tabla con todos los usuarios
3. Ver estadísticas (total, activos, inactivos)
4. Opciones de editar/eliminar

### 3. Crear Usuario
1. Click en "Nuevo Usuario"
2. Rellenar formulario
3. Validación
4. Submit
5. Redirección al dashboard

### 4. Editar Usuario
1. Click en "Editar" en tabla
2. Formulario pre-rellenado
3. Modificar datos
4. Submit
5. Actualización en tabla

### 5. Eliminar Usuario
1. Click en "Eliminar" en tabla
2. Modal de confirmación
3. Confirmar eliminación
4. Tabla actualizada

## 🔒 Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🐛 Troubleshooting

### Error de conexión al backend
```
- Verificar que backend está corriendo en http://localhost:8080
- Verificar CORS configurado correctamente
- Revisar console del navegador
```

### Token expirado
```
- Limpiar localStorage
- Hacer logout e iniciar sesión nuevamente
```

### Tabla no carga
```
- Verificar conexión a internet
- Verificar endpoint /api/usuarios está disponible
- Revisar headers de autenticación
```

## 👥 Integrantes

- **iTzAsaro** - Backend
- **yael-nq** - Frontend

## 📅 Fecha de Creación

Junio 2026

## 📝 Notas

- Proyecto desarrollado como evaluación diagnóstica
- Código comentado y bien estructurado
- Listo para producción con configuración adicional
- Soporta integración con diferentes backends

---

**Estado**: ✅ Completado