package com.tpy1101.config;

import com.tpy1101.entity.Usuario;
import com.tpy1101.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    public DataInitializer(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Verificar si ya existe un usuario admin
        if (usuarioRepository.count() == 0) {
            // Crear usuario de prueba
            Usuario admin = new Usuario(
                    "admin@ejemplo.com",
                    "Admin",
                    "Administrador",
                    "123456" // Contraseña de prueba (en un entorno real, esto estaría encriptado)
            );
            usuarioRepository.save(admin);
            System.out.println("✅ Usuario de prueba creado: admin@ejemplo.com / 123456");
        }
    }
}
