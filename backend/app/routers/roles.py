from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.config.security import verify_password, create_access_token, get_current_user
from app.models.models import Usuario
from app.schemas.schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == datos.correo).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    if not verify_password(datos.contrasenha, usuario.contrasenha):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    token = create_access_token(data={"sub": usuario.id_usuario})

    return {
        "access_token": token,
        "token_type": "bearer",
        "id_rol": usuario.id_rol,
        "nomUsu": usuario.nomUsu
    }


@router.get("/me")
def me(current_user: Usuario = Depends(get_current_user)):
    return {
        "id_usuario": current_user.id_usuario,
        "nomUsu": current_user.nomUsu,
        "correo": current_user.correo,
        "id_rol": current_user.id_rol
    }