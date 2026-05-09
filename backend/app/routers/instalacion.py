from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Instalacion, Zona
from app.schemas.schemas import InstalacionCreate, InstalacionRead
import uuid

router = APIRouter(prefix="/instalaciones", tags=["Instalaciones"])


@router.get("/", response_model=list[InstalacionRead])
def listar_instalaciones(db: Session = Depends(get_db)):
    return db.query(Instalacion).all()


@router.get("/{id_instalacion}", response_model=InstalacionRead)
def obtener_instalacion(id_instalacion: str, db: Session = Depends(get_db)):
    instalacion = db.query(Instalacion).filter(
        Instalacion.id_instalacion == id_instalacion
    ).first()
    if not instalacion:
        raise HTTPException(status_code=404, detail="Instalación no encontrada")
    return instalacion


@router.post("/", response_model=InstalacionRead, status_code=status.HTTP_201_CREATED)
def crear_instalacion(datos: InstalacionCreate, db: Session = Depends(get_db)):
    zona = db.query(Zona).filter(Zona.id_zona == datos.id_zona).first()
    if not zona:
        raise HTTPException(status_code=404, detail="Zona no encontrada")

    nueva = Instalacion(
        id_instalacion=datos.id_instalacion or str(uuid.uuid4())[:20],
        nomInst=datos.nomInst,
        id_zona=datos.id_zona,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.put("/{id_instalacion}", response_model=InstalacionRead)
def actualizar_instalacion(
    id_instalacion: str,
    datos: InstalacionCreate,
    db: Session = Depends(get_db),
):
    instalacion = db.query(Instalacion).filter(
        Instalacion.id_instalacion == id_instalacion
    ).first()
    if not instalacion:
        raise HTTPException(status_code=404, detail="Instalación no encontrada")

    zona = db.query(Zona).filter(Zona.id_zona == datos.id_zona).first()
    if not zona:
        raise HTTPException(status_code=404, detail="Zona no encontrada")

    instalacion.nomInst = datos.nomInst
    instalacion.id_zona = datos.id_zona
    db.commit()
    db.refresh(instalacion)
    return instalacion


@router.delete("/{id_instalacion}")
def eliminar_instalacion(id_instalacion: str, db: Session = Depends(get_db)):
    instalacion = db.query(Instalacion).filter(
        Instalacion.id_instalacion == id_instalacion
    ).first()
    if not instalacion:
        raise HTTPException(status_code=404, detail="Instalación no encontrada")
    db.delete(instalacion)
    db.commit()
    return {"mensaje": f"Instalación {id_instalacion} eliminada correctamente"}
