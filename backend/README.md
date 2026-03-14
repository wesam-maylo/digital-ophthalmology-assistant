# FastAPI Backend (SQLite)

## 1) Environment Setup

Requires Python 3.10+.

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:

- Windows (PowerShell)

```powershell
.venv\Scripts\Activate.ps1
```

- macOS/Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Equivalent direct install command from your requirements:

```bash
pip install fastapi uvicorn sqlalchemy pydantic python-multipart pillow flask-cors
```

## 2) Run Server

```bash
uvicorn app.main:app --reload
```

Server: `http://127.0.0.1:8000`
Docs: `http://127.0.0.1:8000/docs`

## 3) API Endpoints

- `GET /api/v1/health`
  - Response: `{"status":"ok"}`
- `POST /api/v1/upload`
  - Form field: `file` (image)
  - Response includes DB `id` and `image_id`
- `POST /api/v1/predict`
  - JSON body: `{"id": 1}`
  - Runs AI prediction for uploaded image
- `GET /api/v1/results/{id}`
  - Fetch single stored result
- `GET /api/v1/results`
  - Optional filters:
    - `min_confidence` (0.0-1.0)
    - `date_from` (ISO datetime)
    - `date_to` (ISO datetime)
- `DELETE /api/v1/results/{id}`
  - Delete a prediction

## 4) cURL Testing

Health:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

Upload:

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/upload" -F "file=@C:/path/to/image.jpg"
```

Predict (replace ID):

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d "{\"id\":1}"
```

Get result:

```bash
curl "http://127.0.0.1:8000/api/v1/results/1"
```

List filtered results:

```bash
curl "http://127.0.0.1:8000/api/v1/results?min_confidence=0.8"
```

## 5) Database

SQLite file is created at:

- `backend/predictions.db`

Table:

- `predictions`
  - `id`
  - `image_path`
  - `prediction`
  - `confidence`
  - `created_at`

## 6) Notes

- CORS is enabled for all origins in development (`allow_origins=["*"]`).
- AI service is mocked in `app/services/ai_service.py`:
  - `predict_image(path) -> ("Normal", 0.85)`
- Replace mock logic with your real model when ready.
<!--  -->