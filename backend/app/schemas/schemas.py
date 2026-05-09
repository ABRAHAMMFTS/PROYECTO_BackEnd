from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime, time


class UsuarioBase(BaseModel):
    correo:          str
    nomUsu:          str
    edad:            int
    sexo:            str
    municipio:       str
    telefono:        Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contrasenha:     str

class UsuarioRead(UsuarioBase):
    id_usuario:      str
    id_rol:          Optional[int] = 2
    fecha_creacion:  date
    class Config:
        from_attributes = True



class DeporteBase(BaseModel):
    nomDepo: str

class DeporteCreate(DeporteBase):
    id_deporte: str

class DeporteRead(DeporteBase):
    id_deporte: str
    class Config:
        from_attributes = True



class ZonaBase(BaseModel):
    nomZona: str
    municipio: str

class ZonaCreate(ZonaBase):
    id_zona: str

class ZonaRead(ZonaBase):
    id_zona: str
    class Config:
        from_attributes = True



class InstalacionBase(BaseModel):
    nomInst: str
    id_zona: str

class InstalacionCreate(InstalacionBase):
    id_instalacion: str

class InstalacionRead(InstalacionBase):
    id_instalacion: str
    class Config:
        from_attributes = True



class EntrenadorBase(BaseModel):
    anhos_exp: Optional[int] = None
    id_instalacion: str

class EntrenadorCreate(EntrenadorBase):
    id_entrenador: str

class EntrenadorRead(EntrenadorBase):
    id_entrenador: str
    class Config:
        from_attributes = True



class HorarioBase(BaseModel):
    dias: date
    hora_ini: time
    hora_fin: time
    id_instalacion: str

class HorarioCreate(HorarioBase):
    id_horario: str

class HorarioRead(HorarioBase):
    id_horario: str
    class Config:
        from_attributes = True



class EquipoBase(BaseModel):
    nomEqui: str
    cant_int: int
    cat_gen: str
    cat_edad: int
    id_deporte: str

class EquipoCreate(EquipoBase):
    id_equipo: str

class EquipoRead(EquipoBase):
    id_equipo: str
    class Config:
        from_attributes = True



class PublicacionBase(BaseModel):
    tipo: str
    titulo: str
    ruta_img: Optional[str] = None
    contenido: Optional[str] = None
    fecha_publi: datetime
    id_usuario: Optional[str] = None
    id_equipo: Optional[str] = None

class PublicacionCreate(PublicacionBase):
    id_publi: str

class PublicacionRead(PublicacionBase):
    id_publi: str
    class Config:
        from_attributes = True


class EventoBase(BaseModel):
    nomEve:         str
    fecha_ini:      date
    fecha_fin:      date
    descripcion:    str
    id_deporte:     str
    id_instalacion: str
    id_usuario:     str

class EventoCreate(EventoBase):
    id_evento: str

class EventoRead(EventoBase):
    id_evento: str
    class Config:
        from_attributes = True


class ReservaBase(BaseModel):
    id_usuario:     Optional[str] = None
    id_equipo:      Optional[str] = None
    id_instalacion: str
    id_horario:     str
    fecha_resIni:   datetime
    fecha_resFin:   datetime

class ReservaCreate(ReservaBase):
    pass

class ReservaRead(ReservaBase):
    id_reserva: str
    class Config:
        from_attributes = True




class InscripcionBase(BaseModel):
    id_equipo: str
    id_evento: str

class InscripcionCreate(InscripcionBase):
    id_inscripcion: str

class InscripcionRead(InscripcionBase):
    id_inscripcion: str
    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    correo: str
    contrasenha: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    id_rol: int
    nomUsu: str
    id_usuario: str

class RolRead(BaseModel):
    id_rol: int
    nombre: str
    class Config:
        from_attributes = True