from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.db import Base, engine

# IMPORTANTE:
# importar modelos para que SQLAlchemy registre las tablas
from app.models.models import *

from app.routers import (
    usuarios, deporte, zona, instalacion,
    entrenador, horario, equipo, publicacion,
    evento, reserva, inscripcion, auth, participantes
)

app = FastAPI(title="SportPoint API", version="1.0.0")

# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(deporte.router)
app.include_router(zona.router)
app.include_router(instalacion.router)
app.include_router(entrenador.router)
app.include_router(horario.router)
app.include_router(equipo.router)
app.include_router(publicacion.router)
app.include_router(evento.router)
app.include_router(reserva.router)
app.include_router(inscripcion.router)
app.include_router(participantes.router)
