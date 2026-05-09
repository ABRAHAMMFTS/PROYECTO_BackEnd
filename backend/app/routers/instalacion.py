from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Evento
from app.schemas.schemas import EventoCreate, EventoRead
import uuid

router = APIRouter(prefix="/eventos", tags=["Eventos"])


@router.get("/", response_model=list[EventoRead])
def listar_eventos(db: Session = Depends(get_db)):
    return db.query(Evento).all()


@router.get("/{id_evento}", response_model=EventoRead)
def obtener_evento(id_evento: str, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id_evento == id_evento).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return evento


@router.post("/", response_model=EventoRead)
def crear_evento(datos: EventoCreate, db: Session = Depends(get_db)):
    nuevo = Evento(
        id_evento      = str(uuid.uuid4())[:20],
        nombre         = datos.nombre,
        id_deporte     = datos.id_deporte,
        fecha_inicio   = datos.fecha_inicio,
        id_instalacion = datos.id_instalacion,
        organizador    = datos.organizador,
        descripcion    = datos.descripcion
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.put("/{id_evento}", response_model=EventoRead)
def actualizar_evento(id_evento: str, datos: EventoCreate, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id_evento == id_evento).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    evento.nombre         = datos.nombre
    evento.id_deporte     = datos.id_deporte
    evento.fecha_inicio   = datos.fecha_inicio
    evento.id_instalacion = datos.id_instalacion
    evento.organizador    = datos.organizador
    evento.descripcion    = datos.descripcion
    db.commit()
    db.refresh(evento)
    return evento


@router.delete("/{id_evento}")
def eliminar_evento(id_evento: str, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id_evento == id_evento).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    db.delete(evento)
    db.commit()
    return {"mensaje": f"Evento {id_evento} eliminado correctamente"}