import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Alert } from './Alert';
import { AppHeader } from './AppHeader';

export function UsuarioForm({ isEditMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    activo: true
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [actionMessage, setActionMessage] = useState(null);

  // Cargar datos del usuario si es modo edición
  useEffect(() => {
    if (isEditMode && id) {
      fetchUser();
    }
  }, [isEditMode, id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/usuarios/${id}`);
      const { contrasena, ...dataWithoutPassword } = response.data;
      setFormData(prev => ({ 
        ...prev, 
        ...dataWithoutPassword,
        contrasena: ''
      }));
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: 'Error al cargar los datos del usuario.'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!isEditMode && !formData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena && formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener mínimo 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const dataToSend = { ...formData };
      // No enviar contraseña vacía en modo edición
      if (isEditMode && !dataToSend.contrasena) {
        delete dataToSend.contrasena;
      }

      if (isEditMode) {
        await api.put(`/usuarios/${id}`, dataToSend);
        setActionMessage({ 
          type: 'success', 
          text: 'Usuario actualizado exitosamente.' 
        });
      } else {
        await api.post('/usuarios', dataToSend);
        setActionMessage({ 
          type: 'success', 
          text: 'Usuario creado exitosamente.' 
        });
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Response data:', err.response?.data);
      const errorMsg = 
        err.response?.data?.error || 
        err.response?.data?.message ||
        Object.values(err.response?.data || {}).join(', ') ||
        'Error al guardar el usuario.';
      setActionMessage({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isEditMode 
                ? 'Actualiza los datos del usuario' 
                : 'Completa el formulario para crear un nuevo usuario'}
            </p>
          </div>

          {actionMessage && (
            <Alert
              message={actionMessage.text}
              type={actionMessage.type}
              onClose={() => actionMessage.type === 'success' ? null : setActionMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border ${
                    errors.nombre ? 'border-rose-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 hover:bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Juan"
                  disabled={submitting}
                />
                {errors.nombre && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border ${
                    errors.apellido ? 'border-rose-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 hover:bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Pérez"
                  disabled={submitting}
                />
                {errors.apellido && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.apellido}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border ${
                  errors.email ? 'border-rose-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 hover:bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="juan@ejemplo.cl"
                disabled={submitting || isEditMode}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>
              )}
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditMode ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border ${
                    errors.contrasena ? 'border-rose-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 hover:bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                  disabled={submitting}
                />
                {errors.contrasena && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.contrasena}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <div className="flex items-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 hover:bg-white transition">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="activo" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Activo
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {submitting 
                  ? (isEditMode ? 'Actualizando...' : 'Creando...') 
                  : (isEditMode ? 'Actualizar Usuario' : 'Crear Usuario')
                }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}