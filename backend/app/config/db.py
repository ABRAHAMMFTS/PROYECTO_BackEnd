import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv

load_dotenv()

POSTGRES_SERVER = os.getenv("POSTGRES_SERVER", "127.0.0.1")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "sportpoint")
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "")
"""
database_url = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:DET28DVMapgvwkIP@db.xiqwgapmkxzjfcraeqzz.supabase.co:5432/postgres"
)
#database_url = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
"""
database_url = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:DET28DVMapgvwkIP@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
)
try:
    engine = create_engine(database_url, pool_pre_ping=True)
    # Verificar conexión
    with engine.connect() as conn:
        print("Conexión a la base de datos exitosa")
except OperationalError as e:
    print(f"Error de conexión a la base de datos: {e}")
    print("Asegúrate de que PostgreSQL esté corriendo y las credenciales sean correctas")
    # En producción, podrías querer salir o manejar de otra forma
    # Para desarrollo, continuamos sin DB
    engine = None

if engine:
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
else:
    SessionLocal = None

Base = declarative_base()

def get_db():
    if SessionLocal:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        # Si no hay conexión, yield None o manejar error
        yield None
