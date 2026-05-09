from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Deporte
from app.schemas.schemas import DeporteCreate, DeporteRead
 
router = APIRouter(prefix="/deportes", tags=["Deportes"])
 
@router.get("/", response_model=list[DeporteRead])
def listar_deportes(db: Session = Depends(get_db)):
    return db.query(Deporte).all()
 
@router.get("/{id_deporte}", response_model=DeporteRead)
def obtener_deporte(id_deporte: str, db: Session = Depends(get_db)):
    d = db.query(Deporte).filter(Deporte.id_deporte == id_deporte).first()
    if not d:
        raise HTTPException(status_code=404, detail="Deporte no encontrado")
    return d
 
@router.post("/", response_model=DeporteRead)
def crear_deporte(datos: DeporteCreate, db: Session = Depends(get_db)):
    existe = db.query(Deporte).filter(Deporte.id_deporte == datos.id_deporte).first()
    if existe:
        raise HTTPException(status_code=400, detail="El deporte ya existe")
    nuevo = Deporte(id_deporte=datos.id_deporte, nombre=datos.nombre, descripcion=datos.descripcion)
    db.add(nuevo); db.commit(); db.refresh(nuevo)
    return nuevo
 
@router.put("/{id_deporte}", response_model=DeporteRead)
def actualizar_deporte(id_deporte: str, datos: DeporteCreate, db: Session = Depends(get_db)):
    d = db.query(Deporte).filter(Deporte.id_deporte == id_deporte).first()
    if not d:
        raise HTTPException(status_code=404, detail="Deporte no encontrado")
    d.nombre = datos.nombre; d.descripcion = datos.descripcion
    db.commit(); db.refresh(d)
    return d
 
@router.delete("/{id_deporte}")
def eliminar_deporte(id_deporte: str, db: Session = Depends(get_db)):
    d = db.query(Deporte).filter(Deporte.id_deporte == id_deporte).first()
    if not d:
        raise HTTPException(status_code=404, detail="Deporte no encontrado")
    db.delete(d); db.commit()
    return {"mensaje": f"Deporte {id_deporte} eliminado"}