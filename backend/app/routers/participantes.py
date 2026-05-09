from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import ParticipanteEvento
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/participantes", tags=["Participantes"])


class ParticipanteCreate(BaseModel):
    id_evento:  str
    id_usuario: str
    id_equipo:  str
    estado:     str = "pendiente"

class ParticipanteRead(BaseModel):
    id_participante_evento: str
    id_evento:              str
    id_usuario:             str
    id_equipo:              str
    estado:                 str
    class Config:
        from_attributes = True


@router.get("/", response_model=list[ParticipanteRead])
def listar_participantes(db: Session = Depends(get_db)):
    return db.query(ParticipanteEvento).all()


@router.get("/{id_participante}", response_model=ParticipanteRead)
def obtener_participante(id_participante: str, db: Session = Depends(get_db)):
    p = db.query(ParticipanteEvento).filter(
        ParticipanteEvento.id_participante_evento == id_participante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    return p


@router.get("/evento/{id_evento}", response_model=list[ParticipanteRead])
def participantes_por_evento(id_evento: str, db: Session = Depends(get_db)):
    return db.query(ParticipanteEvento).filter(
        ParticipanteEvento.id_evento == id_evento
    ).all()


@router.post("/", response_model=ParticipanteRead)
def crear_participante(datos: ParticipanteCreate, db: Session = Depends(get_db)):
    nuevo = ParticipanteEvento(
        id_participante_evento = str(uuid.uuid4())[:20],
        id_evento              = datos.id_evento,
        id_usuario             = datos.id_usuario,
        id_equipo              = datos.id_equipo,
        estado                 = datos.estado
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.put("/{id_participante}", response_model=ParticipanteRead)
def actualizar_participante(id_participante: str, datos: ParticipanteCreate, db: Session = Depends(get_db)):
    p = db.query(ParticipanteEvento).filter(
        ParticipanteEvento.id_participante_evento == id_participante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    p.id_evento  = datos.id_evento
    p.id_usuario = datos.id_usuario
    p.id_equipo  = datos.id_equipo
    p.estado     = datos.estado
    db.commit()
    db.refresh(p)
    return p


@router.delete("/{id_participante}")
def eliminar_participante(id_participante: str, db: Session = Depends(get_db)):
    p = db.query(ParticipanteEvento).filter(
        ParticipanteEvento.id_participante_evento == id_participante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    db.delete(p)
    db.commit()
    return {"mensaje": "Participante eliminado correctamente"}