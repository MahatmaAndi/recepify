## Supabase setup

The backend already speaks SQLModel/SQLAlchemy, so pointing it at Supabase is just a matter of using
the Postgres connection string. Recommended steps:

1. **Create a Supabase project**
   - Visit https://supabase.com, create a project and note the database password.
   - In *Project Settings → Database*, copy the _Connection string_ (choose `psycopg`).
     It looks like `postgresql+psycopg://postgres:<password>@db.<id>.supabase.co:5432/postgres`.
2. **Provision the schema**
   - In the Supabase SQL editor paste the contents of [`schema.sql`](./schema.sql) and run it once.
     This creates the `recipe`, `ingredient`, `instruction_step`, and `recipe_tag` tables with the same
     structure the FastAPI backend expects.
3. **Configure the backend**
   - Duplicate `backend/.env.example` → `backend/.env`.
   - Set `DATABASE_URL` to the connection string from step 1 and keep `STORAGE_DIR`/`OPENAI_API_KEY`
     as needed.
4. **Run the backend**
   - `cd backend && source .venv/bin/activate`
   - `pip install -r requirements.txt` (includes `psycopg` for Postgres).
   - `uvicorn app.main:app --reload`

`init_db()` runs automatically on startup and ensures the tables exist. From this point on every
import or manual recipe you add from the frontend is saved in Supabase instead of the ephemeral
SQLite file. If you ever need to seed Supabase with the content of the old `recipefy.db`, you can
temporarily point `DATABASE_URL` back to the SQLite file, export the data, and re-import it using
your preferred tool (pg_dump/pgloader/etc.).
