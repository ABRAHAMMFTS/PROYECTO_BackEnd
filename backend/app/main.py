from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    usuarios, deporte, instalacion,
    equipo, horario, evento, reserva,
    publicacion, auth, roles, participantes
)

app = FastAPI(title="SportPoint API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://localhost:4201",
        "http://127.0.0.1:4200",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://sportpoint-jade.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(deporte.router)
app.include_router(instalacion.router)
app.include_router(equipo.router)
app.include_router(horario.router)
app.include_router(evento.router)
app.include_router(reserva.router)
app.include_router(publicacion.router)
app.include_router(roles.router)
app.include_router(participantes.router)