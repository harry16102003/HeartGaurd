# HeartGaurd Deployment

## Local launch without opening a terminal

- Double-click `start_heartguard.vbs` to start the FastAPI server in the background and open the site.
- If Windows blocks `.vbs`, run `start_heartguard.bat` instead.

## Free deployment option

This project is prepared for a free Render web service:

1. Push the repository to GitHub.
2. Create a new Render Web Service from the repo.
3. Render will detect `render.yaml`.
4. The app will start with `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`.

## Important limitation

- The backend currently stores prediction history in an Excel file.
- On free cloud platforms, local files are usually ephemeral, so Excel history may reset when the instance restarts or redeploys.
- For durable multi-user deployment, replace Excel persistence with SQLite or PostgreSQL.
