from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Equipo
from app.schemas.schemas import EquipoCreate, EquipoRead
import uuid
 
router = APIRouter(prefix="/equipos", tags=["Equipos"])
 
@router.get("/", response_model=list[EquipoRead])
def listar_equipos(db: Session = Depends(get_db)):
    return db.query(Equipo).all()
 
@router.get("/{id_equipo}", response_model=EquipoRead)
def obtener_equipo(id_equipo: str, db: Session = Depends(get_db)):
    e = db.query(Equipo).filter(Equipo.id_equipo == id_equipo).first()
    if not e:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return e
 
@router.post("/", response_model=EquipoRead)
def crear_equipo(datos: EquipoCreate, db: Session = Depends(get_db)):
    nuevo = Equipo(
        id_equipo=str(uuid.uuid4())[:20],
        nombre=datos.nombre,
        id_capitan=datos.id_capitan,
        cantidad_integrantes=datos.cantidad_integrantes,
        categorizacion=datos.categorizacion,
        id_deporte=datos.id_deporte,
        nivel=datos.nivel
    )
    db.add(nuevo); db.commit(); db.refresh(nuevo)
    return nuevo
 
@router.put("/{id_equipo}", response_model=EquipoRead)
def actualizar_equipo(id_equipo: str, datos: EquipoCreate, db: Session = Depends(get_db)):
    e = db.query(Equipo).filter(Equipo.id_equipo == id_equipo).first()
    if not e:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    e.nombre=datos.nombre; e.id_capitan=datos.id_capitan
    e.cantidad_integrantes=datos.cantidad_integrantes
    e.categorizacion=datos.categorizacion; e.id_deporte=datos.id_deporte; e.nivel=datos.nivel
    db.commit(); db.refresh(e)
    return e
 
@router.delete("/{id_equipo}")
def eliminar_equipo(id_equipo: str, db: Session = Depends(get_db)):
    e = db.query(Equipo).filter(Equipo.id_equipo == id_equipo).first()
    if not e:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    db.delete(e); db.commit()
    return {"mensaje": f"Equipo {id_equipo} eliminado"}
