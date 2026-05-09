from sqlalchemy.orm import Session
from app.config.db import SessionLocal
from app.models.models import Usuario
import uuid
from datetime import date

def test_create_user():
    db = SessionLocal()
    try:
        nuevo = Usuario(
            id_usuario     = str(uuid.uuid4()),
            correo         = f"test_{uuid.uuid4().hex[:6]}@test.com",
            edad           = 25,
            sexo           = "M",
            municipio      = "cartagena",
            contrasenha    = "test1234",
            nomUsu         = "Test User",
            telefono       = "1234567890",
            id_rol         = 2,
            fecha_creacion = date.today()
        )
        db.add(nuevo)
        db.commit()
        print("Usuario creado con éxito")
        db.delete(nuevo)
        db.commit()
    except Exception as e:
        print(f"Error al crear usuario: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_create_user()
