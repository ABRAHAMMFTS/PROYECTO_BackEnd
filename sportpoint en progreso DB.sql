-- MySQL Database Dump
-- Converted from PostgreSQL
Create database sportpoint_bd;

use sportpoint_bd;

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ----------------------------
-- Table: deporte
-- ----------------------------
CREATE TABLE deporte (
    id_deporte VARCHAR(15) NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    instalacion VARCHAR(30) NOT NULL,
    CONSTRAINT deporte_pk PRIMARY KEY (id_deporte)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

-- ----------------------------
-- Table: usuario
-- ----------------------------
CREATE TABLE usuario (
    id_usuario VARCHAR(10) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    sexo CHAR NOT NULL,
    municipio varchar(20) not null,
    contrasenia_hash VARCHAR(20) NOT NULL,
    nombre_completo VARCHAR(50) NOT NULL,
    telefono VARCHAR(11),
    rol CHAR NOT NULL,
    fecha_creacion DATE,
    id_deporte VARCHAR(15) NOT NULL,
    CONSTRAINT usuario_pk PRIMARY KEY (id_usuario),
    CONSTRAINT usuario_correo_uk UNIQUE (correo),
    CONSTRAINT usuario_rol_ck CHECK (rol IN ('D' , 'E', 'A')),
    CONSTRAINT sexo_ck CHECK (sexo IN ('M' , 'F')),
    CONSTRAINT municipio_ck CHECK (municipio IN (
    'achi',
    'altosrosario',
    'arenal',
    'arjona',
    'arroyohondo',
    'barrancoloba',
    'bocachica',
    'calamar',
    'cantagallo',
    'cartagena',
    'cicuco',
    'clemencia',
    'cordoba',
    'carmen',
    'elpenon',
    'hatilloloba',
    'magangue',
    'margarita',
    'marialbaja',
    'mompox',
    'montecristo',
    'morales',
    'norosí',
    'pinillos',
    'regidor',
    'rioviejo',
    'sancristobal',
    'sanestanislao',
    'sanfer',
    'sanja',
    'sanjuannepo',
    'sanmartinloba',
    'sanpablo',
    'santacatalina',
    'santarosalima',
    'santarosanorte',
    'simiti',
    'soplaviento',
    'talaigua',
    'tiquisio',
    'turbaco',
    'turbana',
    'villanueva',
    'zambrano'
))
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

-- ----------------------------
-- Table: perfil_entrenador
-- ----------------------------
CREATE TABLE perfil_entrenador (
    id_perfil_entrenador VARCHAR(10) NOT NULL,
    id_usuario           VARCHAR(10) NOT NULL,
    anios_experiencia    INT,
    id_deporte           VARCHAR(15) NOT NULL,
    CONSTRAINT perfil_entrenador_pk PRIMARY KEY (id_perfil_entrenador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: equipo
-- ----------------------------
CREATE TABLE equipo (
    id_equipo             VARCHAR(10) NOT NULL,
    nombre                VARCHAR(50) NOT NULL,
    id_capitan            VARCHAR(10) NOT NULL,
    cantidad_integrantes  INT         NOT NULL,
    categorizacion        VARCHAR(15) NOT NULL,
    id_deporte            VARCHAR(15) NOT NULL,
    nivel                 VARCHAR(20),
    CONSTRAINT equipo_pk             PRIMARY KEY (id_equipo),
    CONSTRAINT equipo_categorizacion_ck CHECK (categorizacion IN ('masculino', 'femenino', 'mixto')),
    CONSTRAINT equipo_integrantes_ck    CHECK (cantidad_integrantes > 0),
    CONSTRAINT equipo_nivel_ck          CHECK (nivel IS NULL OR nivel IN ('juvenil', 'amateur', 'semiprofesional', 'profesional'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: publicacion
-- ----------------------------
CREATE TABLE publicacion (
    id_publicacion VARCHAR(10)  NOT NULL,
    tipo           VARCHAR(30)  NOT NULL,
    titulo         VARCHAR(20)  NOT NULL,
    contenido      TEXT         NOT NULL,
    id_deporte     VARCHAR(15)  NOT NULL,
    fecha          DATE         NOT NULL,
    hora           TIME         NOT NULL,
    CONSTRAINT publicacion_pk      PRIMARY KEY (id_publicacion),
    CONSTRAINT publicacion_tipo_ck CHECK (tipo IN ('noticia', 'evento', 'anuncio', 'reclutamiento', 'servicio de entrenamiento'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: instalacion
-- ----------------------------
CREATE TABLE instalacion (
    id_instalacion VARCHAR(10)  NOT NULL,
    nombre         VARCHAR(50)  NOT NULL,
    direccion      VARCHAR(100) NOT NULL,
    zona           VARCHAR(50)  NOT NULL,
    id_deporte     VARCHAR(15)  NOT NULL,
    admin_lugar    VARCHAR(50)  NOT NULL,
    CONSTRAINT instalacion_pk PRIMARY KEY (id_instalacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: horario_disponible
-- ----------------------------
CREATE TABLE horario_disponible (
    id_horario_disponible VARCHAR(10) NOT NULL,
    id_instalacion        VARCHAR(10) NOT NULL,
    dia_semana            INT         NOT NULL,
    hora_inicio           TIME        NOT NULL,
    hora_fin              TIME        NOT NULL,
    CONSTRAINT horario_disponible_pk       PRIMARY KEY (id_horario_disponible),
    CONSTRAINT check_horas                 CHECK (hora_inicio < hora_fin),
    CONSTRAINT horario_disponible_dia_ck   CHECK (dia_semana >= 1 AND dia_semana <= 7)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: evento
-- ----------------------------
CREATE TABLE evento (
    id_evento      VARCHAR(10)  NOT NULL,
    nombre         VARCHAR(50)  NOT NULL,
    id_deporte     VARCHAR(15)  NOT NULL,
    fecha_inicio   DATE         NOT NULL,
    id_instalacion VARCHAR(10)  NOT NULL,
    organizador    VARCHAR(20)  NOT NULL,
    descripcion    VARCHAR(100),
    CONSTRAINT evento_pk PRIMARY KEY (id_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: integrante_equipo
-- ----------------------------
CREATE TABLE integrante_equipo (
    id_integrante_equipo VARCHAR(10) NOT NULL,
    id_equipo            VARCHAR(10) NOT NULL,
    id_usuario           VARCHAR(10) NOT NULL,
    rol_en_equipo        VARCHAR(50) NOT NULL,
    CONSTRAINT integrante_equipo_pk PRIMARY KEY (id_integrante_equipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: participante_evento
-- ----------------------------
CREATE TABLE participante_evento (
    id_participante_evento VARCHAR(10) NOT NULL,
    id_evento              VARCHAR(10) NOT NULL,
    id_usuario             VARCHAR(10) NOT NULL,
    id_equipo              VARCHAR(10) NOT NULL,
    estado                 VARCHAR(15) NOT NULL,
    CONSTRAINT participante_evento_pk       PRIMARY KEY (id_participante_evento),
    CONSTRAINT participante_evento_estado_ck CHECK (estado IN ('pendiente', 'confirmado', 'cancelado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table: reserva
-- ----------------------------
CREATE TABLE reserva (
    id_reserva            VARCHAR(10) NOT NULL,
    id_usuario            VARCHAR(10) NOT NULL,
    id_equipo             VARCHAR(10) NOT NULL,
    id_instalacion        VARCHAR(10) NOT NULL,
    id_horario_disponible VARCHAR(10) NOT NULL,
    fecha_r               DATE        NOT NULL,
    CONSTRAINT reserva_pk    PRIMARY KEY (id_reserva),
    CONSTRAINT reserva_unica UNIQUE (id_instalacion, fecha_r, id_horario_disponible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- FOREIGN KEYS
-- ============================================================
ALTER TABLE deporte
	ADD CONSTRAINT deporte_usuario_fk
		foreign key (id_deporte) REFERENCES usuario (id_deporte);
-- Hacer tabla intermedia entre deporte y usuario
ALTER TABLE usuario
    ADD CONSTRAINT usuario_deporte_fk
        FOREIGN KEY (id_deporte) REFERENCES deporte (id_deporte);

ALTER TABLE perfil_entrenador
    ADD CONSTRAINT perfil_entrenador_deporte_fk
        FOREIGN KEY (id_deporte) REFERENCES deporte (id_deporte),
    ADD CONSTRAINT viaje_id_usuario_fk
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario);

ALTER TABLE equipo
    ADD CONSTRAINT equipo_deporte_fk
        FOREIGN KEY (id_deporte) REFERENCES deporte (id_deporte),
    ADD CONSTRAINT equipo_id_capitan_fk
        FOREIGN KEY (id_capitan) REFERENCES usuario (id_usuario);

ALTER TABLE publicacion
    ADD CONSTRAINT publicacion_id_deporte_fk
        FOREIGN KEY (id_deporte) REFERENCES deporte (id_deporte);

ALTER TABLE instalacion
    ADD CONSTRAINT instalacion_id_deporte_fk
        FOREIGN KEY (id_deporte) REFERENCES deporte (id_deporte);

ALTER TABLE horario_disponible
    ADD CONSTRAINT horario_disponible_id_instalacion_fk
        FOREIGN KEY (id_instalacion) REFERENCES instalacion (id_instalacion);

ALTER TABLE evento
    ADD CONSTRAINT evento_id_deporte_fk
        FOREIGN KEY (id_deporte) REFERENCES deporte (id_deporte),
    ADD CONSTRAINT evento_id_instalacion_fk
        FOREIGN KEY (id_instalacion) REFERENCES instalacion (id_instalacion);

ALTER TABLE integrante_equipo
    ADD CONSTRAINT integrante_equipo_id_equipo
        FOREIGN KEY (id_equipo) REFERENCES equipo (id_equipo),
    ADD CONSTRAINT integrante_equipo_id_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario);

ALTER TABLE participante_evento
    ADD CONSTRAINT participante_evento_id_evento_fk
        FOREIGN KEY (id_evento) REFERENCES evento (id_evento),
    ADD CONSTRAINT participante_evento_id_usuario_fk
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    ADD CONSTRAINT participante_evento_id_equipo_fk
        FOREIGN KEY (id_equipo) REFERENCES equipo (id_equipo);

ALTER TABLE reserva
    ADD CONSTRAINT reserva_id_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    ADD CONSTRAINT reserva_id_equipo
        FOREIGN KEY (id_equipo) REFERENCES equipo (id_equipo),
    ADD CONSTRAINT reserva_instalacion
        FOREIGN KEY (id_instalacion) REFERENCES instalacion (id_instalacion),
    ADD CONSTRAINT reserva_horario_fk
        FOREIGN KEY (id_horario_disponible) REFERENCES horario_disponible (id_horario_disponible);

SET FOREIGN_KEY_CHECKS = 1;