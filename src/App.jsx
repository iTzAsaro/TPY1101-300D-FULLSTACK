import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { UsuarioList } from './components/UsuarioList';
import { UsuarioForm } from './components/UsuarioForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta de Login - pública */}
          <Route path="/login" element={<LoginForm />} />

          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UsuarioList />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/crear-usuario" 
            element={
              <ProtectedRoute>
                <UsuarioForm isEditMode={false} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/editar-usuario/:id" 
            element={
              <ProtectedRoute>
                <UsuarioForm isEditMode={true} />
              </ProtectedRoute>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;