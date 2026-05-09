from datetime import date, datetime
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.db import SessionLocal
from app.models.models import (
    Deporte,
    Evento,
    Instalacion,
    ParticipanteEvento,
    Publicacion,
    Rol,
    Usuario,
    Zona,
)


def ensure_schema_compatibility(db: Session) -> None:
    """Apply safe Supabase schema patches required by the demo data.

    SQLAlchemy's create_all creates missing tables but does not alter existing
    Supabase columns. These statements are intentionally idempotent so Render can
    run them on every startup without conflicts.
    """
    statements = [
        "ALTER TABLE public.evento ALTER COLUMN \"nomEve\" TYPE VARCHAR(100)",
        "ALTER TABLE public.publicacion ALTER COLUMN titulo TYPE VARCHAR(200)",
        """
        CREATE TABLE IF NOT EXISTS public.rol (
            id_rol INTEGER PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL
        )
        """,
        """
        INSERT INTO public.rol (id_rol, nombre)
        VALUES (1, 'Administrador'), (2, 'Usuario')
        ON CONFLICT (id_rol) DO UPDATE SET nombre = EXCLUDED.nombre
        """,
        """
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
        END $$
        """,
        """
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
        END $$
        """,
        "UPDATE public.usuario SET id_rol = 2 WHERE id_rol IS NULL",
        """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_rol_usuario'
            ) THEN
                ALTER TABLE public.usuario
                ADD CONSTRAINT fk_rol_usuario
                FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);
            END IF;
        END $$
        """,
        """
        CREATE TABLE IF NOT EXISTS public.participante_evento (
            id_participante_evento VARCHAR(36) PRIMARY KEY,
            id_evento VARCHAR(50) REFERENCES public.evento(id_evento),
            id_usuario VARCHAR(50) REFERENCES public.usuario(id_usuario),
            id_equipo VARCHAR(50) REFERENCES public.equipo(id_equipo),
            estado VARCHAR(50) DEFAULT 'Inscrito'
        )
        """,
        "ALTER TABLE public.participante_evento ALTER COLUMN estado TYPE VARCHAR(50)",
    ]

    for statement in statements:
        db.execute(text(statement))
    db.commit()


def _upsert_usuario(db: Session, data: dict) -> None:
    usuario = db.query(Usuario).filter(Usuario.id_usuario == data["id_usuario"]).first()
    if usuario:
        usuario.correo = data["correo"]
        usuario.edad = data["edad"]
        usuario.sexo = data["sexo"]
        usuario.municipio = data["municipio"]
        usuario.contrasenha = data["contrasenha"]
        usuario.nomUsu = data["nomUsu"]
        usuario.telefono = data["telefono"]
        usuario.id_rol = data["id_rol"]
        return

    db.add(Usuario(fecha_creacion=date.today(), **data))


def seed_demo_data() -> None:
    """Create the minimum demo data used by the public app and admin panel.

    The function is idempotent so it can run safely on each Render startup against
    Supabase without duplicating records or overwriting user-created rows outside
    this controlled demo set.
    """
    if SessionLocal is None:
        print("Seed omitido: no hay conexión de base de datos disponible.")
        return

    db: Session = SessionLocal()
    try:
        ensure_schema_compatibility(db)

        roles_data = [
            {"id_rol": 1, "nombre": "Administrador"},
            {"id_rol": 2, "nombre": "Usuario"},
        ]
        for rol_data in roles_data:
            rol = db.query(Rol).filter(Rol.id_rol == rol_data["id_rol"]).first()
            if rol:
                rol.nombre = rol_data["nombre"]
            else:
                db.add(Rol(**rol_data))
        db.commit()

        deportes_data = [
            "Fútbol",
            "Baloncesto",
            "Natación",
            "Tenis",
            "Boxeo",
            "Halterofilia",
            "Atletismo",
            "Calistenia",
            "Ciclismo",
            "Softbol",
            "Voleibol",
        ]
        for depo in deportes_data:
            deporte = db.query(Deporte).filter(Deporte.id_deporte == depo).first()
            if deporte:
                deporte.nomDepo = depo
            else:
                db.add(Deporte(id_deporte=depo, nomDepo=depo))
        db.commit()

        zonas_data = [
            {"id_zona": "Z-01", "nomZona": "Zona Norte", "municipio": "Cartagena"},
            {"id_zona": "ZNTE01", "nomZona": "Norte - Centro", "municipio": "Cartagena"},
            {"id_zona": "ZNTE02", "nomZona": "Norte Residencial", "municipio": "Cartagena"},
            {"id_zona": "ZCTO01", "nomZona": "Península Turística", "municipio": "Cartagena"},
            {"id_zona": "ZCTO02", "nomZona": "Residencial Central", "municipio": "Cartagena"},
            {"id_zona": "ZSUR01", "nomZona": "Suroriente", "municipio": "Cartagena"},
        ]
        for zona_data in zonas_data:
            zona = db.query(Zona).filter(Zona.id_zona == zona_data["id_zona"]).first()
            if zona:
                zona.nomZona = zona_data["nomZona"]
                zona.municipio = zona_data["municipio"]
            else:
                db.add(Zona(**zona_data))
        db.commit()

        usuarios_data = [
            {
                "id_usuario": "admin-001",
                "correo": "admin@sportpoint.com",
                "edad": 30,
                "sexo": "M",
                "municipio": "Cartagena",
                "contrasenha": "admin123",
                "nomUsu": "Admin SportPoint",
                "telefono": "3000000000",
                "id_rol": 1,
            },
            {
                "id_usuario": "demo-user-001",
                "correo": "ana@sportpoint.com",
                "edad": 24,
                "sexo": "F",
                "municipio": "Cartagena",
                "contrasenha": "demo123",
                "nomUsu": "Ana Rojas",
                "telefono": "3001111111",
                "id_rol": 2,
            },
            {
                "id_usuario": "demo-user-002",
                "correo": "carlos@sportpoint.com",
                "edad": 27,
                "sexo": "M",
                "municipio": "Turbaco",
                "contrasenha": "demo123",
                "nomUsu": "Carlos Díaz",
                "telefono": "3002222222",
                "id_rol": 2,
            },
            {
                "id_usuario": "demo-user-003",
                "correo": "laura@sportpoint.com",
                "edad": 21,
                "sexo": "F",
                "municipio": "Arjona",
                "contrasenha": "demo123",
                "nomUsu": "Laura Pérez",
                "telefono": "3003333333",
                "id_rol": 2,
            },
            {
                "id_usuario": "demo-user-004",
                "correo": "miguel@sportpoint.com",
                "edad": 29,
                "sexo": "M",
                "municipio": "Magangué",
                "contrasenha": "demo123",
                "nomUsu": "Miguel Torres",
                "telefono": "3004444444",
                "id_rol": 2,
            },
            {
                "id_usuario": "demo-user-005",
                "correo": "sofia@sportpoint.com",
                "edad": 23,
                "sexo": "F",
                "municipio": "Cartagena",
                "contrasenha": "demo123",
                "nomUsu": "Sofía Gómez",
                "telefono": "3005555555",
                "id_rol": 2,
            },
        ]
        for usuario_data in usuarios_data:
            _upsert_usuario(db, usuario_data)
        db.commit()

        instalaciones_data = [
            {"id_instalacion": "INST-01", "nomInst": "Polideportivo Norte", "id_zona": "Z-01"},
            {"id_instalacion": "I1", "nomInst": "Estadio Municipal de Cartagena", "id_zona": "ZNTE01"},
            {"id_instalacion": "I2", "nomInst": "Polideportivo Central", "id_zona": "ZCTO02"},
            {"id_instalacion": "I3", "nomInst": "Complejo Acuático Bolívar", "id_zona": "ZSUR01"},
        ]
        for inst_data in instalaciones_data:
            inst = db.query(Instalacion).filter(Instalacion.id_instalacion == inst_data["id_instalacion"]).first()
            if inst:
                inst.nomInst = inst_data["nomInst"]
                inst.id_zona = inst_data["id_zona"]
            else:
                db.add(Instalacion(**inst_data))
        db.commit()

        eventos_data = [
            {"id_evento": "EV-NEW-01", "nomEve": "Torneo Fútbol 5", "descripcion": "Gran torneo de fútbol.", "id_deporte": "Fútbol", "fecha": "2026-06-05", "id_instalacion": "INST-01"},
            {"id_evento": "E1", "nomEve": "Torneo Barrial", "descripcion": "Liga local de fútbol en fase eliminatoria.", "id_deporte": "Fútbol", "fecha": "2026-05-10", "id_instalacion": "I1"},
            {"id_evento": "E2", "nomEve": "Basketball Cup", "descripcion": "Campeonato juvenil categoría 14-18 años.", "id_deporte": "Baloncesto", "fecha": "2026-05-12", "id_instalacion": "I2"},
            {"id_evento": "E3", "nomEve": "Nado Libre", "descripcion": "Competencia en piscina olímpica.", "id_deporte": "Natación", "fecha": "2026-05-15", "id_instalacion": "I3"},
            {"id_evento": "E4", "nomEve": "Torneo Softbol", "descripcion": "UTB vs UDC - Gran final universitaria.", "id_deporte": "Softbol", "fecha": "2026-05-16", "id_instalacion": "I1"},
            {"id_evento": "E5", "nomEve": "Copa Voleibol", "descripcion": "Selecciones Sub-20 en competencia regional.", "id_deporte": "Voleibol", "fecha": "2026-05-17", "id_instalacion": "I2"},
            {"id_evento": "E6", "nomEve": "Boxeo Amateur", "descripcion": "Velada deportiva de peso pluma.", "id_deporte": "Boxeo", "fecha": "2026-05-19", "id_instalacion": "I2"},
            {"id_evento": "E7", "nomEve": "Copa Tenis", "descripcion": "Torneo abierto nivel aficionado con llaves mixtas.", "id_deporte": "Tenis", "fecha": "2026-05-21", "id_instalacion": "I2"},
            {"id_evento": "E8", "nomEve": "Ruta Ciclismo", "descripcion": "Recorrido competitivo por la zona norte de Bolívar.", "id_deporte": "Ciclismo", "fecha": "2026-05-24", "id_instalacion": "I1"},
            {"id_evento": "E9", "nomEve": "Reto Calistenia", "descripcion": "Competencia urbana de fuerza, resistencia y freestyle.", "id_deporte": "Calistenia", "fecha": "2026-05-27", "id_instalacion": "I2"},
            {"id_evento": "E10", "nomEve": "Open Halterofilia", "descripcion": "Pruebas de levantamiento olímpico por categorías.", "id_deporte": "Halterofilia", "fecha": "2026-05-30", "id_instalacion": "I3"},
        ]
        for ev_data in eventos_data:
            fecha = datetime.strptime(ev_data["fecha"], "%Y-%m-%d").date()
            evento = db.query(Evento).filter(Evento.id_evento == ev_data["id_evento"]).first()
            if evento:
                evento.nomEve = ev_data["nomEve"]
                evento.fecha_ini = fecha
                evento.fecha_fin = fecha
                evento.descripcion = ev_data["descripcion"]
                evento.id_deporte = ev_data["id_deporte"]
                evento.id_instalacion = ev_data["id_instalacion"]
                evento.id_usuario = "admin-001"
            else:
                db.add(Evento(
                    id_evento=ev_data["id_evento"],
                    nomEve=ev_data["nomEve"],
                    fecha_ini=fecha,
                    fecha_fin=fecha,
                    descripcion=ev_data["descripcion"],
                    id_deporte=ev_data["id_deporte"],
                    id_instalacion=ev_data["id_instalacion"],
                    id_usuario="admin-001",
                ))
        db.commit()

        participantes_data = [
            {"id_participante_evento": "PE-demo-001", "id_evento": "E1", "id_usuario": "demo-user-001"},
            {"id_participante_evento": "PE-demo-002", "id_evento": "E2", "id_usuario": "demo-user-002"},
            {"id_participante_evento": "PE-demo-003", "id_evento": "E7", "id_usuario": "demo-user-003"},
            {"id_participante_evento": "PE-demo-004", "id_evento": "E8", "id_usuario": "demo-user-004"},
            {"id_participante_evento": "PE-demo-005", "id_evento": "E9", "id_usuario": "demo-user-005"},
        ]
        for participante_data in participantes_data:
            participante = db.query(ParticipanteEvento).filter(
                ParticipanteEvento.id_participante_evento == participante_data["id_participante_evento"]
            ).first()
            if participante:
                participante.id_evento = participante_data["id_evento"]
                participante.id_usuario = participante_data["id_usuario"]
                participante.estado = "Inscrito"
            else:
                db.add(ParticipanteEvento(
                    id_participante_evento=participante_data["id_participante_evento"],
                    id_evento=participante_data["id_evento"],
                    id_usuario=participante_data["id_usuario"],
                    id_equipo=None,
                    estado="Inscrito",
                ))
        db.commit()

        publicaciones_data = [
            {
                "id_publi": "PUB-01",
                "tipo": "Noticia",
                "titulo": "¡Nuevas Reservas!",
                "ruta_img": "assets/photos/patinadores_montemaria.jpg",
                "contenido": "Ya puedes reservar cupos individuales.",
                "fecha_publi": datetime.now(),
                "id_usuario": "admin-001",
                "id_equipo": None,
            }
        ]
        for publi_data in publicaciones_data:
            publicacion = db.query(Publicacion).filter(Publicacion.id_publi == publi_data["id_publi"]).first()
            if publicacion:
                publicacion.tipo = publi_data["tipo"]
                publicacion.titulo = publi_data["titulo"]
                publicacion.ruta_img = publi_data["ruta_img"]
                publicacion.contenido = publi_data["contenido"]
                publicacion.fecha_publi = publi_data["fecha_publi"]
                publicacion.id_usuario = publi_data["id_usuario"]
                publicacion.id_equipo = publi_data["id_equipo"]
            else:
                db.add(Publicacion(**publi_data))
        db.commit()

        print("Seed demo SportPoint sincronizado correctamente.")
    except Exception as exc:
        db.rollback()
        print(f"Error durante el seed demo SportPoint: {exc}")
    finally:
        db.close()
