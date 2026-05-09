from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Horario, Instalacion, Reserva, Usuario
from app.schemas.schemas import ReservaCreate, ReservaRead
import uuid

router = APIRouter(prefix="/reservas", tags=["Reservas"])


@router.get("/", response_model=list[ReservaRead])
def listar_reservas(db: Session = Depends(get_db)):
    return db.query(Reserva).all()


@router.get("/{id_reserva}", response_model=ReservaRead)
def obtener_reserva(id_reserva: str, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id_reserva == id_reserva).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return reserva


@router.post("/", response_model=ReservaRead, status_code=status.HTTP_201_CREATED)
def crear_reserva(datos: ReservaCreate, db: Session = Depends(get_db)):
    if datos.fecha_resFin <= datos.fecha_resIni:
        raise HTTPException(
            status_code=400,
            detail="La fecha final de la reserva debe ser posterior a la fecha inicial",
        )

    if datos.id_usuario:
        usuario = db.query(Usuario).filter(Usuario.id_usuario == datos.id_usuario).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

    instalacion = db.query(Instalacion).filter(
        Instalacion.id_instalacion == datos.id_instalacion
    ).first()
    if not instalacion:
        raise HTTPException(status_code=404, detail="Instalación no encontrada")

    horario = db.query(Horario).filter(Horario.id_horario == datos.id_horario).first()
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")

    reserva_existente = db.query(Reserva).filter(
        Reserva.id_instalacion == datos.id_instalacion,
        Reserva.id_horario == datos.id_horario,
        Reserva.fecha_resIni < datos.fecha_resFin,
        Reserva.fecha_resFin > datos.fecha_resIni,
    ).first()
    if reserva_existente:
        raise HTTPException(
            status_code=409,
            detail="Ya existe una reserva para ese horario e instalación",
        )

    nueva = Reserva(
        id_reserva=str(uuid.uuid4())[:20],
        id_usuario=datos.id_usuario,
        id_equipo=datos.id_equipo,
        id_instalacion=datos.id_instalacion,
        id_horario=datos.id_horario,
        fecha_resIni=datos.fecha_resIni,
        fecha_resFin=datos.fecha_resFin,
    )

    try:
        db.add(nueva)
        db.commit()
        db.refresh(nueva)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No se pudo crear la reserva. Inténtalo de nuevo.",
        ) from exc

    return nueva


@router.delete("/{id_reserva}")
def eliminar_reserva(id_reserva: str, db: Session = Depends(get_db)):
    reserva = db.query(Reserva).filter(Reserva.id_reserva == id_reserva).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    db.delete(reserva)
    db.commit()
    return {"mensaje": f"Reserva {id_reserva} eliminada"}
