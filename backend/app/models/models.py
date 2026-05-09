from sqlalchemy import (
    Column, String, Integer, Date, DateTime,
    Time, Text, ForeignKey, CHAR
)
from app.config.db import Base


class Rol(Base):
    __tablename__ = "rol"

    id_rol = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(20), nullable=False)


class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario       = Column(String(50), primary_key=True)
    correo           = Column(String(50), nullable=False)
    contrasenia_hash = Column(String(100), nullable=False)
    nombre_completo  = Column(String(50), nullable=False)
    telefono         = Column(String(15))
    rol              = Column(String(20), nullable=False)
    fecha_creacion   = Column(Date)
    id_deporte       = Column(String(50), ForeignKey("deporte.id_deporte"), nullable=False)
    id_rol           = Column(Integer, ForeignKey("rol.id_rol"))
    sexo             = Column(CHAR(1))


class Deporte(Base):
    __tablename__ = "deporte"

    id_deporte  = Column(String(50), primary_key=True)
    nombre      = Column(String(50), nullable=False)
    descripcion = Column(Text, nullable=False)


class Instalacion(Base):
    __tablename__ = "instalacion"

    id_instalacion = Column(String(20), primary_key=True)
    nombre         = Column(String(100), nullable=False)
    direccion      = Column(String(100), nullable=False)
    zona           = Column(String(20), nullable=False)
    id_deporte     = Column(String(50), ForeignKey("deporte.id_deporte"), nullable=False)
    admin_lugar    = Column(String(50), nullable=False)


class HorarioDisponible(Base):
    __tablename__ = "horario_disponible"

    id_horario_disponible = Column(String(20), primary_key=True)
    id_instalacion        = Column(String(20), ForeignKey("instalacion.id_instalacion"), nullable=False)
    dia_semana            = Column(Integer, nullable=False)
    hora_inicio           = Column(Time, nullable=False)
    hora_fin              = Column(Time, nullable=False)


class Equipo(Base):
    __tablename__ = "equipo"

    id_equipo            = Column(String(20), primary_key=True)
    nombre               = Column(String(50), nullable=False)
    id_capitan           = Column(String(50), ForeignKey("usuario.id_usuario"), nullable=False)
    cantidad_integrantes = Column(Integer, nullable=False)
    categorizacion       = Column(String(20), nullable=False)
    id_deporte           = Column(String(50), ForeignKey("deporte.id_deporte"), nullable=False)
    nivel                = Column(String(20))


class IntegranteEquipo(Base):
    __tablename__ = "integrante_equipo"

    id_integrante_equipo = Column(String(20), primary_key=True)
    id_equipo            = Column(String(20), ForeignKey("equipo.id_equipo"), nullable=False)
    id_usuario           = Column(String(50), ForeignKey("usuario.id_usuario"), nullable=False)
    rol_en_equipo        = Column(String(30), nullable=False)


class Evento(Base):
    __tablename__ = "evento"

    id_evento      = Column(String(20), primary_key=True)
    nombre         = Column(String(50), nullable=False)
    id_deporte     = Column(String(50), ForeignKey("deporte.id_deporte"), nullable=False)
    fecha_inicio   = Column(Date, nullable=False)
    id_instalacion = Column(String(20), ForeignKey("instalacion.id_instalacion"), nullable=False)
    organizador    = Column(String(50), ForeignKey("usuario.id_usuario"), nullable=False)
    descripcion    = Column(String(200))


class ParticipanteEvento(Base):
    __tablename__ = "participante_evento"

    id_participante_evento = Column(String(20), primary_key=True)
    id_evento              = Column(String(20), ForeignKey("evento.id_evento"), nullable=False)
    id_usuario             = Column(String(50), ForeignKey("usuario.id_usuario"), nullable=False)
    id_equipo              = Column(String(20), ForeignKey("equipo.id_equipo"), nullable=False)
    estado                 = Column(String(20), nullable=False)


class PerfilEntrenador(Base):
    __tablename__ = "perfil_entrenador"

    id_perfil_entrenador = Column(String(20), primary_key=True)
    id_usuario           = Column(String(50), ForeignKey("usuario.id_usuario"), nullable=False)
    anios_experiencia    = Column(Integer)
    id_deporte           = Column(String(50), ForeignKey("deporte.id_deporte"), nullable=False)


class Publicacion(Base):
    __tablename__ = "publicacion"

    id_publicacion = Column(String(20), primary_key=True)
    tipo           = Column(String(20), nullable=False)
    titulo         = Column(String(100), nullable=False)
    contenido      = Column(Text, nullable=False)
    id_deporte     = Column(String(50), ForeignKey("deporte.id_deporte"), nullable=False)
    fecha          = Column(Date, nullable=False)
    hora           = Column(Time, nullable=False)


class Reserva(Base):
    __tablename__ = "reserva"

    id_reserva            = Column(String(20), primary_key=True)
    id_usuario            = Column(String(50), ForeignKey("usuario.id_usuario"), nullable=False)
    id_equipo             = Column(String(20), ForeignKey("equipo.id_equipo"), nullable=False)
    id_instalacion        = Column(String(20), ForeignKey("instalacion.id_instalacion"), nullable=False)
    id_horario_disponible = Column(String(20), ForeignKey("horario_disponible.id_horario_disponible"), nullable=False)
    fecha_r               = Column(Date, nullable=False)