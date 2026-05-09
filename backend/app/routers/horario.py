from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import HorarioDisponible
from app.schemas.schemas import HorarioCreate, HorarioRead
import uuid
 
router = APIRouter(prefix="/horarios", tags=["Horarios"])
 
@router.get("/", response_model=list[HorarioRead])
def listar_horarios(db: Session = Depends(get_db)):
    return db.query(HorarioDisponible).all()
 
@router.get("/{id_horario_disponible}", response_model=HorarioRead)
def obtener_horario(id_horario_disponible: str, db: Session = Depends(get_db)):
    h = db.query(HorarioDisponible).filter(HorarioDisponible.id_horario_disponible == id_horario_disponible).first()
    if not h:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    return h
 
@router.post("/", response_model=HorarioRead)
def crear_horario(datos: HorarioCreate, db: Session = Depends(get_db)):
    nuevo = HorarioDisponible(
        id_horario_disponible=str(uuid.uuid4())[:20],
        id_instalacion=datos.id_instalacion,
        dia_semana=datos.dia_semana,
        hora_inicio=datos.hora_inicio,
        hora_fin=datos.hora_fin
    )
    db.add(nuevo); db.commit(); db.refresh(nuevo)
    return nuevo
 
@router.delete("/{id_horario_disponible}")
def eliminar_horario(id_horario_disponible: str, db: Session = Depends(get_db)):
    h = db.query(HorarioDisponible).filter(HorarioDisponible.id_horario_disponible == id_horario_disponible).first()
    if not h:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    db.delete(h); db.commit()
    return {"mensaje": f"Horario {id_horario_disponible} eliminado"}