import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// 1. CONFIGURACIÓN DE API (Axios Simulator / Real API)
// ==========================================
// En un entorno de producción o local real, usarías:
// import axios from 'axios';
// const API_BASE_URL = 'http://localhost:8080/api';
// const api = axios.create({ baseURL: API_BASE_URL });
//
// Para garantizar que esta demo en el Canvas sea 100% interactiva e ilustrativa,
// implementamos un "Mock API" con retraso de red simulado, pero dejamos la estructura lista
// para cambiar fácilmente a Axios real.

const API_BASE_URL = 'http://localhost:8080/api';

// Datos iniciales de prueba (Mock Data)
const INITAL_USERS = [
  { id: 1, email: 'admin@tpy1101.cl', nombre: 'Admin', apellido: 'Sistema', estado: 'Activo' },
  { id: 2, email: 'juan.perez@correo.cl', nombre: 'Juan', apellido: 'Pérez', estado: 'Activo' },
  { id: 3, email: 'maria.gonzalez@correo.cl', nombre: 'María', apellido: 'González', estado: 'Inactivo' },
  { id: 4, email: 'diego.portales@correo.cl', nombre: 'Diego', apellido: 'Portales', estado: 'Activo' },
];

// Simulador de llamadas HTTP (con retraso de 500ms para simular carga real)
const apiMock = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (email === 'admin@tpy1101.cl' && password === '123456') {
      return { token: 'mock-jwt-token-123456', user: { email, nombre: 'Admin', apellido: 'Sistema' } };
    }
    throw new Error('Credenciales inválidas. Intenta con admin@tpy1101.cl y 123456');
  },
  getUsuarios: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('tpy_users');
    if (!stored) {
      localStorage.setItem('tpy_users', JSON.stringify(INITAL_USERS));
      return INITAL_USERS;
    }
    return JSON.parse(stored);
  },
  createUsuario: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const stored = JSON.parse(localStorage.getItem('tpy_users') || JSON.stringify(INITAL_USERS));
    const newId = stored.length > 0 ? Math.max(...stored.map(u => u.id)) + 1 : 1;
    const newUser = { id: newId, ...userData, estado: 'Activo' };
    const updated = [...stored, newUser];
    localStorage.setItem('tpy_users', JSON.stringify(updated));
    return newUser;
  },
  updateUsuario: async (id, userData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const stored = JSON.parse(localStorage.getItem('tpy_users') || JSON.stringify(INITAL_USERS));
    const updated = stored.map(u => u.id === Number(id) ? { ...u, ...userData } : u);
    localStorage.setItem('tpy_users', JSON.stringify(updated));
    return { id, ...userData };
  },
  deleteUsuario: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = JSON.parse(localStorage.getItem('tpy_users') || JSON.stringify(INITAL_USERS));
    const updated = stored.filter(u => u.id !== Number(id));
    localStorage.setItem('tpy_users', JSON.stringify(updated));
    return { success: true };
  }
};

// ==========================================
// 2. CONTEXTO DE AUTENTICACIÓN (AuthContext)
// ==========================================
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tpy_user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tpy_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Cambio rápido de Mock a Real:
      // const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      // const data = response.data;
      const data = await apiMock.login(email, password);
     
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('tpy_token', data.token);
      localStorage.setItem('tpy_user_session', JSON.stringify(data.user));
      return true;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tpy_token');
    localStorage.removeItem('tpy_user_session');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ==========================================
// 3. COMPONENTES REUTILIZABLES DE LA INTERFAZ
// ==========================================

// Alertas del Sistema
function Alert({ message, type = 'error', onClose }) {
  if (!message) return null;
  const bgCol = type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800';
  return (
    <div className={`border-l-4 p-4 rounded-md mb-4 flex justify-between items-start ${bgCol} transition-all duration-300 shadow-sm`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ) : (
          <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}

// Modal de Confirmación de Eliminación
function ConfirmDeleteModal({ isOpen, userEmail, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
            <svg className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-center text-gray-900 mb-2">¿Eliminar Usuario?</h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            ¿Estás seguro de que deseas eliminar al usuario <strong className="text-gray-800">{userEmail}</strong>? Esta acción no se puede deshacer de forma directa.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-rose-600 rounded-lg text-sm font-semibold text-white hover:bg-rose-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cabecera Principal del Dashboard
function AppHeader({ onLogout, user }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg text-white font-black text-xl tracking-wider shadow">
            TPY
          </div>
          <span className="font-bold text-gray-900 hidden sm:inline">Administración de Usuarios v1101</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {user?.nombre?.[0] || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:inline">
              {user?.nombre} {user?.apellido}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 hover:border-rose-300 text-gray-700 hover:text-rose-600 rounded-lg text-sm font-semibold transition bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

// Tarjeta Informativa (para dashboard)
function DashboardCard({ title, value, icon, bgClass }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bgClass} text-white`}>
        {icon}
      </div>
    </div>
  );
}

// ==========================================
// 4. PÁGINAS Y VISTAS DE LA APLICACIÓN
// ==========================================

// --- LOGIN PAGE ---
function LoginView({ onNavigate }) {
  const { login, error, loading, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Formato de correo electrónico inválido';
    }
    if (!password) {
      errors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener mínimo 6 caracteres';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    const success = await login(email, password);
    if (success) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Bienvenido de nuevo</h2>
          <p className="mt-2 text-indigo-100 text-sm">Gestiona el sistema TPY1101 con tu cuenta</p>
        </div>
        <div className="p-6 sm:p-8">
          <Alert message={error} onClose={() => setError(null)} />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${validationErrors.email ? 'border-rose-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition`}
                  placeholder="ejemplo@tpy1101.cl"
                />
              </div>
              {validationErrors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{validationErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 w-full px-4 py-2.5 bg-gray-50 border ${validationErrors.password ? 'border-rose-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{validationErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 px-4 rounded-lg font-bold hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <span className="text-xs text-gray-400">Credenciales Demo: admin@tpy1101.cl / 123456</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD & LISTING PAGE ---
function DashboardView({ onNavigate, onEditUser, actionMessage, setActionMessage }) {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Reemplazo para Axios real:
      // const res = await axios.get(`${API_BASE_URL}/usuarios`);
      // setUsers(res.data);
      const data = await apiMock.getUsuarios();
      setUsers(data);
    } catch (err) {
      setError('Error al recuperar el listado de usuarios de la API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteRequest = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      // Reemplazo para Axios real:
      // await axios.delete(`${API_BASE_URL}/usuarios/${userToDelete.id}`);
      await apiMock.deleteUsuario(userToDelete.id);
     
      // Actualizar tabla en cliente después de la eliminación exitosa
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setActionMessage({ type: 'success', text: `Usuario ${userToDelete.email} eliminado exitosamente.` });
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Error de comunicación al intentar eliminar el usuario.' });
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const totalUsuarios = users.length;
  const activos = users.filter(u => u.estado === 'Activo').length;
  const inactivos = totalUsuarios - activos;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader user={user} onLogout={() => { logout(); onNavigate('login'); }} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
       
        {/* Banner o feedback superior */}
        {actionMessage && (
          <Alert
            message={actionMessage.text}
            type={actionMessage.type}
            onClose={() => setActionMessage(null)}
          />
        )}

        {/* Tarjetas Informativas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard
            title="Total Usuarios"
            value={totalUsuarios}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            bgClass="bg-indigo-600"
          />
          <DashboardCard
            title="Usuarios Activos"
            value={activos}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            bgClass="bg-emerald-600"
          />
          <DashboardCard
            title="Usuarios Inactivos"
            value={inactivos}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            bgClass="bg-amber-600"
          />
        </div>

        {/* Sección de Acciones */}
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Nuevo Usuario
          </button>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-rose-600 font-medium">{error}</div>
            ) : users.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No hay usuarios registrados</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.nombre} {u.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          {u.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                        <button
                          onClick={() => onEditUser(u)}
                          className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition font-semibold text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(u)}
                          className="px-3 py-1 text-rose-600 hover:bg-rose-50 rounded transition font-semibold text-xs"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal de Eliminación */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          userEmail={userToDelete?.email}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          isDeleting={isDeleting}
        />
      </main>
    </div>
  );
}

// --- CREATE/EDIT USER PAGE ---
function UserFormView({ onNavigate, user, setActionMessage }) {
  const [formData, setFormData] = useState(user ? { nombre: user.nombre, apellido: user.apellido, email: user.email, estado: user.estado } : { nombre: '', apellido: '', email: '', estado: 'Activo' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (user) {
        await apiMock.updateUsuario(user.id, formData);
        setActionMessage({ type: 'success', text: 'Usuario actualizado exitosamente.' });
      } else {
        await apiMock.createUsuario(formData);
        setActionMessage({ type: 'success', text: 'Usuario creado exitosamente.' });
      }
      onNavigate('dashboard');
    } catch (err) {
      setErrors({ submit: 'Error al guardar el usuario' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={`w-full px-4 py-2 border ${errors.nombre ? 'border-rose-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              placeholder="Juan"
            />
            {errors.nombre && <p className="text-xs text-rose-600 mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className={`w-full px-4 py-2 border ${errors.apellido ? 'border-rose-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              placeholder="Pérez"
            />
            {errors.apellido && <p className="text-xs text-rose-600 mt-1">{errors.apellido}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 border ${errors.email ? 'border-rose-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              placeholder="juan@ejemplo.cl"
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {errors.submit && <p className="text-sm text-rose-600 font-medium">{errors.submit}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {loading ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 5. COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [editingUser, setEditingUser] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const navigate = (view, user = null) => {
    setCurrentView(view);
    setEditingUser(user);
  };

  return (
    <AuthProvider>
      {currentView === 'login' && <LoginView onNavigate={navigate} />}
      {currentView === 'dashboard' && <DashboardView onNavigate={navigate} onEditUser={(user) => navigate('form', user)} actionMessage={actionMessage} setActionMessage={setActionMessage} />}
      {currentView === 'form' && <UserFormView onNavigate={navigate} user={editingUser} setActionMessage={setActionMessage} />}
    </AuthProvider>
  );
}