from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import ParticipanteEvento
from app.schemas.schemas import BaseModel
import uuid

router = APIRouter(prefix="/participantes", tags=["Participantes"])

class ParticipanteCreate(BaseModel):
    id_evento: str
    id_usuario: str
    id_equipo: str = None

@router.post("/")
def inscribir_usuario(datos: ParticipanteCreate, db: Session = Depends(get_db)):
    # Verificar si ya está inscrito
    existente = db.query(ParticipanteEvento).filter(
        ParticipanteEvento.id_evento == datos.id_evento,
        ParticipanteEvento.id_usuario == datos.id_usuario
    ).first()
    
    if existente:
        raise HTTPException(status_code=400, detail="El usuario ya está inscrito en este evento")

    nueva = ParticipanteEvento(
        id_participante_evento = str(uuid.uuid4()),
        id_evento              = datos.id_evento,
        id_usuario             = datos.id_usuario,
        id_equipo              = datos.id_equipo,
        estado                 = "Inscrito"
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return {"mensaje": "Inscripción exitosa", "id": nueva.id_participante_evento}

@router.get("/evento/{id_evento}")
def listar_participantes(id_evento: str, db: Session = Depends(get_db)):
    return db.query(ParticipanteEvento).filter(ParticipanteEvento.id_evento == id_evento).all()
