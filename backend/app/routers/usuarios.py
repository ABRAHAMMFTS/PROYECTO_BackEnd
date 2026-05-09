from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.models import Usuario
from app.schemas.schemas import UsuarioCreate, UsuarioRead
from passlib.context import CryptContext
import uuid
from datetime import date

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/", response_model=list[UsuarioRead])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


@router.get("/{id_usuario}", response_model=UsuarioRead)
def obtener_usuario(id_usuario: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@router.post("/", response_model=UsuarioRead)
def crear_usuario(datos: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if existe:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    nuevo = Usuario(
        id_usuario       = str(uuid.uuid4()),
        correo           = datos.correo,
        contrasenia_hash = pwd_context.hash(datos.contrasenia),
        nombre_completo  = datos.nombre_completo,
        telefono         = datos.telefono,
        rol              = datos.rol,
        id_deporte       = datos.id_deporte,
        sexo             = datos.sexo,
        fecha_creacion   = date.today(),
        id_rol           = 2  # rol usuario normal por defecto
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.put("/{id_usuario}", response_model=UsuarioRead)
def actualizar_usuario(id_usuario: str, datos: UsuarioCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.correo           = datos.correo
    usuario.contrasenia_hash = pwd_context.hash(datos.contrasenia)
    usuario.nombre_completo  = datos.nombre_completo
    usuario.telefono         = datos.telefono
    usuario.rol              = datos.rol
    usuario.id_deporte       = datos.id_deporte
    usuario.sexo             = datos.sexo
    db.commit()
    db.refresh(usuario)
    return usuario


@router.delete("/{id_usuario}")
def eliminar_usuario(id_usuario: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return {"mensaje": f"Usuario {id_usuario} eliminado correctamente"}