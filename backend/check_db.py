import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = "postgresql://postgres.xiqwgapmkxzjfcraeqzz:DET28DVMapgvwkIP@aws-1-us-east-2.pooler.supabase.com:5432/postgres"


engine = create_engine(DATABASE_URL)

def check_db():
    inspector = inspect(engine)
    columns = inspector.get_columns('usuario')
    print("Columnas en 'usuario':")
    for col in columns:
        print(f"- {col['name']} ({col['type']})")
    
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    from sqlalchemy import text
    roles = db.execute(text("SELECT * FROM rol")).fetchall()
    print("\nRoles en la tabla 'rol':")
    for r in roles:
        print(f"- {r}")
    db.close()

if __name__ == "__main__":
    try:
        check_db()
    except Exception as e:
        print(f"Error: {e}")
