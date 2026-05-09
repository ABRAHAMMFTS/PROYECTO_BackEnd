
import uuid
from datetime import date, datetime
from sqlalchemy.orm import Session
from app.config.db import engine, SessionLocal
from app.models.models import Usuario, Deporte, Zona, Instalacion, Evento, Horario, Publicacion, Equipo

def seed():
    db: Session = SessionLocal()
    try:
        print("Continuando con la restauracion visual (Publicaciones y Equipos)...")
        admin_id = "admin-001"

        # 1. Insertar Equipos
        equipos_data = [
            {'id': 'EQ1', 'nom': 'Cartagena FC', 'int': 22, 'gen': 'M', 'edad': 20, 'dep': 'Fútbol'},
            {'id': 'EQ2', 'nom': 'Bolívar Basket', 'int': 12, 'gen': 'M', 'edad': 18, 'dep': 'Baloncesto'},
        ]
        for eq in equipos_data:
            if not db.query(Equipo).filter(Equipo.id_equipo == eq['id']).first():
                db.add(Equipo(
                    id_equipo=eq['id'], nomEqui=eq['nom'], cant_int=eq['int'],
                    cat_gen=eq['gen'], cat_edad=eq['edad'], id_deporte=eq['dep']
                ))
        db.commit()
        print("Equipos restaurados.")

        # 2. Insertar Publicaciones (Noticias y Banners)
        publi_data = [
            {
                "id": "P1", "tipo": "Noticia", "titulo": "¡Cartagena FC Campeón!", 
                "img": "assets/photos/patinadores_montemaria.jpg", 
                "cont": "El equipo local logra su primer título regional en una final emocionante.",
                "user": admin_id
            },
            {
                "id": "P2", "tipo": "Evento", "titulo": "Gran Ciclovía Dominical", 
                "img": "assets/photos/niños_aerobicos.jpg", 
                "cont": "Únete a los más de 500 participantes este domingo en la Avenida Santander.",
                "user": admin_id
            },
        ]
        for p in publi_data:
            if not db.query(Publicacion).filter(Publicacion.id_publi == p['id']).first():
                db.add(Publicacion(
                    id_publi=p['id'], tipo=p['tipo'], titulo=p['titulo'],
                    ruta_img=p['img'], contenido=p['cont'], 
                    fecha_publi=datetime.now(), id_usuario=p['user']
                ))
        db.commit()
        print("Publicaciones restauradas.")

        print("\nRESTURACION VISUAL COMPLETA! Todo el contenido dinámico está listo.")

    except Exception as e:
        print(f"Error durante el seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
