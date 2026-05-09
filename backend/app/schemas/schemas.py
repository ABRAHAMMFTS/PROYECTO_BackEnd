from pydantic import BaseModel
from typing import Optional
from datetime import date, time
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── ROL ───────────────────────────────────────────────
class RolRead(BaseModel):
    id_rol: int
    nombre: str
    class Config:
        from_attributes = True


# ── USUARIO ───────────────────────────────────────────
class UsuarioBase(BaseModel):
    correo:          str
    nombre_completo: str
    telefono:        Optional[str] = None
    rol:             str
    id_deporte:      str
    sexo:            Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contrasenia: str  # plana, se hashea en el router

class UsuarioRead(UsuarioBase):
    id_usuario:    str
    fecha_creacion: Optional[date] = None
    id_rol:        Optional[int] = None
    class Config:
        from_attributes = True


# ── DEPORTE ───────────────────────────────────────────
class DeporteBase(BaseModel):
    nombre:      str
    descripcion: str

class DeporteCreate(DeporteBase):
    id_deporte: str

class DeporteRead(DeporteBase):
    id_deporte: str
    class Config:
        from_attributes = True


# ── INSTALACION ───────────────────────────────────────
class InstalacionBase(BaseModel):
    nombre:      str
    direccion:   str
    zona:        str
    id_deporte:  str
    admin_lugar: str

class InstalacionCreate(InstalacionBase):
    id_instalacion: str

class InstalacionRead(InstalacionBase):
    id_instalacion: str
    class Config:
        from_attributes = True


# ── HORARIO DISPONIBLE ────────────────────────────────
class HorarioBase(BaseModel):
    id_instalacion: str
    dia_semana:     int
    hora_inicio:    time
    hora_fin:       time

class HorarioCreate(HorarioBase):
    id_horario_disponible: str

class HorarioRead(HorarioBase):
    id_horario_disponible: str
    class Config:
        from_attributes = True


# ── EQUIPO ────────────────────────────────────────────
class EquipoBase(BaseModel):
    nombre:               str
    id_capitan:           str
    cantidad_integrantes: int
    categorizacion:       str
    id_deporte:           str
    nivel:                Optional[str] = None

class EquipoCreate(EquipoBase):
    id_equipo: str

class EquipoRead(EquipoBase):
    id_equipo: str
    class Config:
        from_attributes = True


# ── INTEGRANTE EQUIPO ─────────────────────────────────
class IntegranteEquipoBase(BaseModel):
    id_equipo:    str
    id_usuario:   str
    rol_en_equipo: str

class IntegranteEquipoCreate(IntegranteEquipoBase):
    id_integrante_equipo: str

class IntegranteEquipoRead(IntegranteEquipoBase):
    id_integrante_equipo: str
    class Config:
        from_attributes = True


# ── EVENTO ────────────────────────────────────────────
class EventoBase(BaseModel):
    nombre:        str
    id_deporte:    str
    fecha_inicio:  date
    id_instalacion: str
    organizador:   str
    descripcion:   Optional[str] = None

class EventoCreate(EventoBase):
    id_evento: str

class EventoRead(EventoBase):
    id_evento: str
    class Config:
        from_attributes = True


# ── PARTICIPANTE EVENTO ───────────────────────────────
class ParticipanteEventoBase(BaseModel):
    id_evento:  str
    id_usuario: str
    id_equipo:  str
    estado:     str

class ParticipanteEventoCreate(ParticipanteEventoBase):
    id_participante_evento: str

class ParticipanteEventoRead(ParticipanteEventoBase):
    id_participante_evento: str
    class Config:
        from_attributes = True


# ── PERFIL ENTRENADOR ─────────────────────────────────
class PerfilEntrenadorBase(BaseModel):
    id_usuario:        str
    anios_experiencia: Optional[int] = None
    id_deporte:        str

class PerfilEntrenadorCreate(PerfilEntrenadorBase):
    id_perfil_entrenador: str

class PerfilEntrenadorRead(PerfilEntrenadorBase):
    id_perfil_entrenador: str
    class Config:
        from_attributes = True


# ── PUBLICACION ───────────────────────────────────────
class PublicacionBase(BaseModel):
    tipo:       str
    titulo:     str
    contenido:  str
    id_deporte: str
    fecha:      date
    hora:       time

class PublicacionCreate(PublicacionBase):
    id_publicacion: str

class PublicacionRead(PublicacionBase):
    id_publicacion: str
    class Config:
        from_attributes = True


# ── RESERVA ───────────────────────────────────────────
class ReservaBase(BaseModel):
    id_usuario:            str
    id_equipo:             str
    id_instalacion:        str
    id_horario_disponible: str
    fecha_r:               date

class ReservaCreate(ReservaBase):
    id_reserva: str

class ReservaRead(ReservaBase):
    id_reserva: str
    class Config:
        from_attributes = True


# ── AUTH ──────────────────────────────────────────────
class LoginRequest(BaseModel):
    correo:      str
    contrasenha: str

class LoginResponse(BaseModel):
    access_token:   str
    token_type:     str
    id_rol:         Optional[int]
    nombre_completo: str