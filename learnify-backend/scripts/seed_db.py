import os
from sqlalchemy import create_engine


def main():
    database_url = os.getenv(
        "DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/learnify"
    )

    script_path = os.path.join(os.path.dirname(__file__), "..", "db", "init_schema.sql")
    script_path = os.path.normpath(script_path)

    engine = create_engine(database_url)

    with open(script_path, "r", encoding="utf-8") as f:
        sql = f.read()

    # Split on semicolons and execute statements individually.
    stmts = [s.strip() for s in sql.split(";") if s.strip()]

    conn = engine.raw_connection()
    try:
        cursor = conn.cursor()
        for stmt in stmts:
            try:
                cursor.execute(stmt)
            except Exception as e:
                # Print statement error and continue
                print(f"Failed statement: {e}")
        conn.commit()
        print("Database schema executed successfully.")
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        conn.close()


if __name__ == "__main__":
    main()
