from os import getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    usuarios, deporte, zona, instalacion,
    entrenador, horario, equipo, publicacion,
    evento, reserva, inscripcion
)

app = FastAPI(title="SportPoint API", version="1.0.0")


cors_origins = [
    "https://sportpoint.vercel.app",
]

frontend_url = getenv("FRONTEND_URL")
if frontend_url:
    cors_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app$|http://localhost(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



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

