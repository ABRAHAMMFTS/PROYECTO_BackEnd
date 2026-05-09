from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.config.security import decode_token
from app.models.models import Evento, ParticipanteEvento, Usuario
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/participantes", tags=["Participantes"])


class ParticipanteCreate(BaseModel):
    id_evento: str
    id_usuario: Optional[str] = None
    id_equipo: Optional[str] = None


def _usuario_desde_token(authorization: Optional[str]) -> Optional[str]:
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None

    payload = decode_token(token)
    if not payload:
        return None

    return payload.get("sub")


@router.get("/")
def listar_todos_participantes(db: Session = Depends(get_db)):
    return db.query(ParticipanteEvento).all()


@router.post("/", status_code=status.HTTP_201_CREATED)
def inscribir_usuario(
    datos: ParticipanteCreate,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(default=None),
):
    id_usuario = datos.id_usuario or _usuario_desde_token(authorization)
    if not id_usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Debes iniciar sesión para reservar un cupo",
        )

    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    evento = db.query(Evento).filter(Evento.id_evento == datos.id_evento).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    existente = db.query(ParticipanteEvento).filter(
        ParticipanteEvento.id_evento == datos.id_evento,
        ParticipanteEvento.id_usuario == id_usuario,
    ).first()

    if existente:
        return {
            "mensaje": "Ya tenías un cupo reservado para este evento",
            "id": existente.id_participante_evento,
            "ya_inscrito": True,
        }

    nueva = ParticipanteEvento(
        id_participante_evento=str(uuid.uuid4()),
        id_evento=datos.id_evento,
        id_usuario=id_usuario,
        id_equipo=datos.id_equipo,
        estado="Inscrito",
    )

    try:
        db.add(nueva)
        db.commit()
        db.refresh(nueva)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No se pudo reservar el cupo del evento. Inténtalo de nuevo.",
        ) from exc

    return {
        "mensaje": "Inscripción exitosa",
        "id": nueva.id_participante_evento,
        "ya_inscrito": False,
    }


@router.get("/evento/{id_evento}")
def listar_participantes(id_evento: str, db: Session = Depends(get_db)):
    return db.query(ParticipanteEvento).filter(ParticipanteEvento.id_evento == id_evento).all()


@router.get("/usuario/{id_usuario}")
def listar_eventos_usuario(id_usuario: str, db: Session = Depends(get_db)):
    """Devuelve las inscripciones de un usuario con los datos del evento."""
    participaciones = (
        db.query(ParticipanteEvento)
        .filter(ParticipanteEvento.id_usuario == id_usuario)
        .all()
    )
    resultado = []
    for p in participaciones:
        evento = db.query(Evento).filter(Evento.id_evento == p.id_evento).first()
        resultado.append({
            "id_participante_evento": p.id_participante_evento,
            "id_evento": p.id_evento,
            "id_usuario": p.id_usuario,
            "estado": p.estado,
            "nombre_evento": evento.nomEve if evento else "Evento desconocido",
            "descripcion": evento.descripcion if evento else "",
            "deporte": evento.id_deporte if evento else "",
            "fecha": str(evento.fecha_ini) if evento else "",
        })
    return resultado
