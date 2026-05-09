from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.db import get_db
from app.config.security import require_admin
from app.models.models import Rol, Usuario
from app.schemas.schemas import RolRead

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("/", response_model=list[RolRead])
def listar_roles(db: Session = Depends(get_db)):
    return db.query(Rol).all()


@router.put("/usuario/{id_usuario}")
def cambiar_rol_usuario(
    id_usuario: str,
    id_rol: int,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_admin),
):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    rol = db.query(Rol).filter(Rol.id_rol == id_rol).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    usuario.id_rol = id_rol
    db.commit()
    db.refresh(usuario)
    return {"mensaje": "Rol actualizado correctamente", "id_usuario": id_usuario, "id_rol": id_rol}
