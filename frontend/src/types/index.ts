export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  estado: 'Activo' | 'Inactivo';
}

export interface CreateUsuarioDTO {
  email: string;
  nombre: string;
  apellido: string;
  contrasena: string;
}

export interface UpdateUsuarioDTO {
  email?: string;
  nombre?: string;
  apellido?: string;
  contrasena?: string;
  estado?: 'Activo' | 'Inactivo';
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    nombre: string;
    apellido: string;
  };
}

export interface AlertMessage {
  type: 'success' | 'error';
  text: string;
}
