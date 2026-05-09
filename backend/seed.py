
import uuid
from datetime import date, datetime
from sqlalchemy.orm import Session
from app.config.db import engine, SessionLocal
from app.models.models import Usuario, Deporte, Zona, Instalacion, Evento, Horario

def seed():
    db: Session = SessionLocal()
    try:
        print("Iniciando restauracion de datos visuales...")

        # 1. Insertar Deportes
        deportes_data = [
            'Fútbol', 'Baloncesto', 'Natación', 'Tenis', 'Boxeo', 
            'Halterofilia', 'Atletismo', 'Calistenia', 'Ciclismo', 'Softbol', 'Voleibol'
        ]
        for depo in deportes_data:
            if not db.query(Deporte).filter(Deporte.id_deporte == depo).first():
                db.add(Deporte(id_deporte=depo, nomDepo=depo))
        db.commit()
        print("Deportes restaurados.")

        # 2. Insertar Zonas
        zonas_data = [
            {'id': 'ZNTE01', 'nombre': 'Norte - Centro', 'muni': 'Cartagena'},
            {'id': 'ZNTE02', 'nombre': 'Norte - Residencial', 'muni': 'Cartagena'},
            {'id': 'ZCTO01', 'nombre': 'Península Turística', 'muni': 'Cartagena'},
            {'id': 'ZCTO02', 'nombre': 'Residencial Central', 'muni': 'Cartagena'},
            {'id': 'ZSUR01', 'nombre': 'Suroriente', 'muni': 'Cartagena'},
        ]
        for z in zonas_data:
            if not db.query(Zona).filter(Zona.id_zona == z['id']).first():
                db.add(Zona(id_zona=z['id'], nomZona=z['nombre'], municipio=z['muni']))
        db.commit()
        print("Zonas restauradas.")

        # 3. Crear Usuario Administrador (para organizar eventos)
        admin_id = "admin-001"
        if not db.query(Usuario).filter(Usuario.id_usuario == admin_id).first():
            admin = Usuario(
                id_usuario=admin_id,
                correo="admin@sportpoint.com",
                edad=30,
                sexo="M",
                municipio="Cartagena",
                contrasenha="admin123",
                nomUsu="AdminSport",
                telefono="3000000000",
                fecha_creacion=date.today()
            )
            db.add(admin)
            db.commit()
        print("Usuario admin creado.")

        # 4. Insertar Instalaciones
        inst_data = [
            {'id': 'I1', 'nom': 'Estadio Municipal de Cartagena', 'zona': 'ZNTE01'},
            {'id': 'I2', 'nom': 'Polideportivo Central', 'zona': 'ZCTO02'},
            {'id': 'I3', 'nom': 'Complejo Acuático Bolívar', 'zona': 'ZSUR01'},
        ]
        for i in inst_data:
            if not db.query(Instalacion).filter(Instalacion.id_instalacion == i['id']).first():
                db.add(Instalacion(id_instalacion=i['id'], nomInst=i['nom'], id_zona=i['zona']))
        db.commit()
        print("Instalaciones restauradas.")

        # 5. Insertar Eventos (Datos visuales del Home)
        eventos_data = [
            {"id": "E1", "nom": "Torneo Barrial", "desc": "Liga local de fútbol en fase eliminatoria.", "dep": "Fútbol", "f": "2026-05-10", "inst": "I1", "muni": "Cartagena"},
            {"id": "E2", "nom": "Basketball Cup", "desc": "Campeonato juvenil categoría 14-18 años.", "dep": "Baloncesto", "f": "2026-05-12", "inst": "I2", "muni": "Cartagena"},
            {"id": "E3", "nom": "Nado Libre", "desc": "Competencia en piscina olímpica.", "dep": "Natación", "f": "2026-05-15", "inst": "I3", "muni": "Cartagena"},
            {"id": "E4", "nom": "Torneo Universitario", "desc": "UTB vs UDC - Gran Final.", "dep": "Softbol", "f": "2026-04-28", "inst": "I1", "muni": "Cartagena"},
            {"id": "E5", "nom": "Femenina Bolivarense", "desc": "Selecciones Sub-20 en competencia.", "dep": "Voleibol", "f": "2026-05-01", "inst": "I2", "muni": "Cartagena"},
            {"id": "E6", "nom": "Amateur Peso Pluma", "desc": "Velada de boxeo aficionado.", "dep": "Boxeo", "f": "2026-05-04", "inst": "I2", "muni": "Cartagena"},
        ]
        for ev in eventos_data:
            if not db.query(Evento).filter(Evento.id_evento == ev['id']).first():
                db.add(Evento(
                    id_evento=ev['id'],
                    nomEve=ev['nom'],
                    fecha_ini=datetime.strptime(ev['f'], '%Y-%m-%d').date(),
                    fecha_fin=datetime.strptime(ev['f'], '%Y-%m-%d').date(),
                    descripcion=ev['desc'],
                    id_deporte=ev['dep'],
                    id_instalacion=ev['inst'],
                    id_usuario=admin_id
                ))
        db.commit()
        print("Eventos restaurados.")

        print("\nPROCESO COMPLETADO! Los datos visuales ya estan en Supabase.")

    except Exception as e:
        print(f"Error durante el seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
