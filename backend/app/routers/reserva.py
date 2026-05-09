from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Reserva
from app.schemas.schemas import ReservaCreate, ReservaRead
import uuid
 
router = APIRouter(prefix="/reservas", tags=["Reservas"])
 
@router.get("/", response_model=list[ReservaRead])
def listar_reservas(db: Session = Depends(get_db)):
    return db.query(Reserva).all()
 
@router.get("/{id_reserva}", response_model=ReservaRead)
def obtener_reserva(id_reserva: str, db: Session = Depends(get_db)):
    r = db.query(Reserva).filter(Reserva.id_reserva == id_reserva).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return r
 
@router.post("/", response_model=ReservaRead)
def crear_reserva(datos: ReservaCreate, db: Session = Depends(get_db)):
    nueva = Reserva(
        id_reserva=str(uuid.uuid4())[:20],
        id_usuario=datos.id_usuario,
        id_equipo=datos.id_equipo,
        id_instalacion=datos.id_instalacion,
        id_horario_disponible=datos.id_horario_disponible,
        fecha_r=datos.fecha_r
    )
    db.add(nueva); db.commit(); db.refresh(nueva)
    return nueva
 
@router.delete("/{id_reserva}")
def eliminar_reserva(id_reserva: str, db: Session = Depends(get_db)):
    r = db.query(Reserva).filter(Reserva.id_reserva == id_reserva).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    db.delete(r); db.commit()
    return {"mensaje": f"Reserva {id_reserva} eliminada"}