-- SportPoint data/schema sync for Supabase.
-- Safe to run multiple times from the Supabase SQL editor.

-- 1. AMPLIAR LÍMITES DE CARACTERES
ALTER TABLE public.evento ALTER COLUMN "nomEve" TYPE VARCHAR(100);
ALTER TABLE public.publicacion ALTER COLUMN titulo TYPE VARCHAR(200);

-- 2. ASEGURAR ROLES BÁSICOS
INSERT INTO public.rol (id_rol, nombre)
VALUES (1, 'Administrador'), (2, 'Usuario')
ON CONFLICT (id_rol) DO UPDATE SET nombre = EXCLUDED.nombre;

DO $$
DECLARE
    seq_name text;
BEGIN
    seq_name := pg_get_serial_sequence('public.rol', 'id_rol');
    IF seq_name IS NOT NULL THEN
        EXECUTE format(
            'SELECT setval(%L, GREATEST((SELECT COALESCE(MAX(id_rol), 1) FROM public.rol), 1), true)',
            seq_name
        );
    END IF;
END $$;

-- 3. ASEGURAR COLUMNA id_rol Y FK EN USUARIO
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'usuario'
          AND column_name = 'id_rol'
    ) THEN
        ALTER TABLE public.usuario ADD COLUMN id_rol INTEGER DEFAULT 2;
    END IF;
END $$;

UPDATE public.usuario SET id_rol = 2 WHERE id_rol IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_rol_usuario') THEN
        ALTER TABLE public.usuario
        ADD CONSTRAINT fk_rol_usuario FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);
    END IF;
END $$;

-- 4. CREAR TABLA PARTICIPANTES
CREATE TABLE IF NOT EXISTS public.participante_evento (
    id_participante_evento VARCHAR(36) PRIMARY KEY,
    id_evento VARCHAR(50) REFERENCES public.evento(id_evento),
    id_usuario VARCHAR(50) REFERENCES public.usuario(id_usuario),
    id_equipo VARCHAR(50) REFERENCES public.equipo(id_equipo),
    estado VARCHAR(50) DEFAULT 'Inscrito'
);
ALTER TABLE public.participante_evento ALTER COLUMN estado TYPE VARCHAR(50);

-- 5. DATOS BASE
INSERT INTO public.deporte (id_deporte, "nomDepo") VALUES
('Fútbol', 'Fútbol'),
('Baloncesto', 'Baloncesto'),
('Natación', 'Natación'),
('Tenis', 'Tenis'),
('Boxeo', 'Boxeo'),
('Halterofilia', 'Halterofilia'),
('Atletismo', 'Atletismo'),
('Calistenia', 'Calistenia'),
('Ciclismo', 'Ciclismo'),
('Softbol', 'Softbol'),
('Voleibol', 'Voleibol')
ON CONFLICT (id_deporte) DO UPDATE SET "nomDepo" = EXCLUDED."nomDepo";

INSERT INTO public.zona (id_zona, "nomZona", municipio) VALUES
('Z-01', 'Zona Norte', 'Cartagena'),
('ZNTE01', 'Norte - Centro', 'Cartagena'),
('ZNTE02', 'Norte Residencial', 'Cartagena'),
('ZCTO01', 'Península Turística', 'Cartagena'),
('ZCTO02', 'Residencial Central', 'Cartagena'),
('ZSUR01', 'Suroriente', 'Cartagena')
ON CONFLICT (id_zona) DO UPDATE SET "nomZona" = EXCLUDED."nomZona", municipio = EXCLUDED.municipio;

INSERT INTO public.instalacion (id_instalacion, "nomInst", id_zona) VALUES
('INST-01', 'Polideportivo Norte', 'Z-01'),
('I1', 'Estadio Municipal de Cartagena', 'ZNTE01'),
('I2', 'Polideportivo Central', 'ZCTO02'),
('I3', 'Complejo Acuático Bolívar', 'ZSUR01')
ON CONFLICT (id_instalacion) DO UPDATE SET "nomInst" = EXCLUDED."nomInst", id_zona = EXCLUDED.id_zona;

-- 6. USUARIOS DEMO
INSERT INTO public.usuario (id_usuario, correo, edad, sexo, municipio, contrasenha, "nomUsu", telefono, id_rol, fecha_creacion) VALUES
('admin-001', 'admin@sportpoint.com', 30, 'M', 'Cartagena', 'admin123', 'Admin SportPoint', '3000000000', 1, CURRENT_DATE),
('demo-user-001', 'ana@sportpoint.com', 24, 'F', 'Cartagena', 'demo123', 'Ana Rojas', '3001111111', 2, CURRENT_DATE),
('demo-user-002', 'carlos@sportpoint.com', 27, 'M', 'Turbaco', 'demo123', 'Carlos Díaz', '3002222222', 2, CURRENT_DATE),
('demo-user-003', 'laura@sportpoint.com', 21, 'F', 'Arjona', 'demo123', 'Laura Pérez', '3003333333', 2, CURRENT_DATE),
('demo-user-004', 'miguel@sportpoint.com', 29, 'M', 'Magangué', 'demo123', 'Miguel Torres', '3004444444', 2, CURRENT_DATE),
('demo-user-005', 'sofia@sportpoint.com', 23, 'F', 'Cartagena', 'demo123', 'Sofía Gómez', '3005555555', 2, CURRENT_DATE)
ON CONFLICT (id_usuario) DO UPDATE SET
correo = EXCLUDED.correo,
edad = EXCLUDED.edad,
sexo = EXCLUDED.sexo,
municipio = EXCLUDED.municipio,
contrasenha = EXCLUDED.contrasenha,
"nomUsu" = EXCLUDED."nomUsu",
telefono = EXCLUDED.telefono,
id_rol = EXCLUDED.id_rol;

-- 7. EVENTOS DEMO
INSERT INTO public.evento (id_evento, "nomEve", fecha_ini, fecha_fin, descripcion, id_deporte, id_instalacion, id_usuario) VALUES
('EV-NEW-01', 'Torneo Fútbol 5', CURRENT_DATE, CURRENT_DATE + 5, 'Gran torneo de fútbol.', 'Fútbol', 'INST-01', 'admin-001'),
('E1', 'Torneo Barrial', DATE '2026-05-10', DATE '2026-05-10', 'Liga local de fútbol en fase eliminatoria.', 'Fútbol', 'I1', 'admin-001'),
('E2', 'Basketball Cup', DATE '2026-05-12', DATE '2026-05-12', 'Campeonato juvenil categoría 14-18 años.', 'Baloncesto', 'I2', 'admin-001'),
('E3', 'Nado Libre', DATE '2026-05-15', DATE '2026-05-15', 'Competencia en piscina olímpica.', 'Natación', 'I3', 'admin-001'),
('E4', 'Torneo Softbol', DATE '2026-05-16', DATE '2026-05-16', 'UTB vs UDC - Gran final universitaria.', 'Softbol', 'I1', 'admin-001'),
('E5', 'Copa Voleibol', DATE '2026-05-17', DATE '2026-05-17', 'Selecciones Sub-20 en competencia regional.', 'Voleibol', 'I2', 'admin-001'),
('E6', 'Boxeo Amateur', DATE '2026-05-19', DATE '2026-05-19', 'Velada deportiva de peso pluma.', 'Boxeo', 'I2', 'admin-001'),
('E7', 'Copa Tenis', DATE '2026-05-21', DATE '2026-05-21', 'Torneo abierto nivel aficionado con llaves mixtas.', 'Tenis', 'I2', 'admin-001'),
('E8', 'Ruta Ciclismo', DATE '2026-05-24', DATE '2026-05-24', 'Recorrido competitivo por la zona norte de Bolívar.', 'Ciclismo', 'I1', 'admin-001'),
('E9', 'Reto Calistenia', DATE '2026-05-27', DATE '2026-05-27', 'Competencia urbana de fuerza, resistencia y freestyle.', 'Calistenia', 'I2', 'admin-001'),
('E10', 'Open Halterofilia', DATE '2026-05-30', DATE '2026-05-30', 'Pruebas de levantamiento olímpico por categorías.', 'Halterofilia', 'I3', 'admin-001')
ON CONFLICT (id_evento) DO UPDATE SET
"nomEve" = EXCLUDED."nomEve",
fecha_ini = EXCLUDED.fecha_ini,
fecha_fin = EXCLUDED.fecha_fin,
descripcion = EXCLUDED.descripcion,
id_deporte = EXCLUDED.id_deporte,
id_instalacion = EXCLUDED.id_instalacion,
id_usuario = EXCLUDED.id_usuario;

-- 8. PARTICIPANTES DEMO
INSERT INTO public.participante_evento (id_participante_evento, id_evento, id_usuario, id_equipo, estado) VALUES
('PE-demo-001', 'E1', 'demo-user-001', NULL, 'Inscrito'),
('PE-demo-002', 'E2', 'demo-user-002', NULL, 'Inscrito'),
('PE-demo-003', 'E7', 'demo-user-003', NULL, 'Inscrito'),
('PE-demo-004', 'E8', 'demo-user-004', NULL, 'Inscrito'),
('PE-demo-005', 'E9', 'demo-user-005', NULL, 'Inscrito')
ON CONFLICT (id_participante_evento) DO UPDATE SET
id_evento = EXCLUDED.id_evento,
id_usuario = EXCLUDED.id_usuario,
id_equipo = EXCLUDED.id_equipo,
estado = EXCLUDED.estado;

-- 9. NOTICIA DEMO
INSERT INTO public.publicacion (id_publi, tipo, titulo, ruta_img, contenido, fecha_publi, id_usuario)
VALUES ('PUB-01', 'Noticia', '¡Nuevas Reservas!', 'assets/photos/patinadores_montemaria.jpg', 'Ya puedes reservar cupos individuales.', CURRENT_TIMESTAMP, 'admin-001')
ON CONFLICT (id_publi) DO UPDATE SET
tipo = EXCLUDED.tipo,
titulo = EXCLUDED.titulo,
ruta_img = EXCLUDED.ruta_img,
contenido = EXCLUDED.contenido,
fecha_publi = EXCLUDED.fecha_publi,
id_usuario = EXCLUDED.id_usuario;
