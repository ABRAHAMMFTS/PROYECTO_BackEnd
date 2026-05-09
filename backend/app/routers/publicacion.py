from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Publicacion
from app.schemas.schemas import PublicacionCreate, PublicacionRead
import uuid
 
router = APIRouter(prefix="/publicaciones", tags=["Publicaciones"])
 
@router.get("/", response_model=list[PublicacionRead])
def listar_publicaciones(db: Session = Depends(get_db)):
    return db.query(Publicacion).all()
 
@router.post("/", response_model=PublicacionRead)
def crear_publicacion(datos: PublicacionCreate, db: Session = Depends(get_db)):
    nueva = Publicacion(
        id_publicacion=str(uuid.uuid4())[:20],
        tipo=datos.tipo, titulo=datos.titulo,
        contenido=datos.contenido, id_deporte=datos.id_deporte,
        fecha=datos.fecha, hora=datos.hora
    )
    db.add(nueva); db.commit(); db.refresh(nueva)
    return nueva
 
@router.delete("/{id_publicacion}")
def eliminar_publicacion(id_publicacion: str, db: Session = Depends(get_db)):
    p = db.query(Publicacion).filter(Publicacion.id_publicacion == id_publicacion).first()
    if not p:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    db.delete(p); db.commit()
    return {"mensaje": f"Publicación {id_publicacion} eliminada"}