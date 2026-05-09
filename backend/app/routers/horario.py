from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Horario, Instalacion
from app.schemas.schemas import HorarioCreate, HorarioRead
import uuid

router = APIRouter(prefix="/horarios", tags=["Horarios"])


@router.get("/", response_model=list[HorarioRead])
def listar_horarios(db: Session = Depends(get_db)):
    return db.query(Horario).all()


@router.get("/{id_horario}", response_model=HorarioRead)
def obtener_horario(id_horario: str, db: Session = Depends(get_db)):
    horario = db.query(Horario).filter(Horario.id_horario == id_horario).first()
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    return horario


@router.post("/", response_model=HorarioRead, status_code=status.HTTP_201_CREATED)
def crear_horario(datos: HorarioCreate, db: Session = Depends(get_db)):
    instalacion = db.query(Instalacion).filter(
        Instalacion.id_instalacion == datos.id_instalacion
    ).first()
    if not instalacion:
        raise HTTPException(status_code=404, detail="Instalación no encontrada")

    nuevo = Horario(
        id_horario=datos.id_horario or str(uuid.uuid4())[:20],
        dias=datos.dias,
        hora_ini=datos.hora_ini,
        hora_fin=datos.hora_fin,
        id_instalacion=datos.id_instalacion,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.delete("/{id_horario}")
def eliminar_horario(id_horario: str, db: Session = Depends(get_db)):
    horario = db.query(Horario).filter(Horario.id_horario == id_horario).first()
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    db.delete(horario)
    db.commit()
    return {"mensaje": f"Horario {id_horario} eliminado"}
