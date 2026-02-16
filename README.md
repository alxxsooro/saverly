# saverly
Stop buying online with no discount codes. Saverly, a software for discovering discount codes in E-Commerce stores.

## Run locally

### Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev

Open http://localhost:3000

### Backend
cd backend
(Si no tienes creado el .venv) python -m venv .venv
# PowerShell:
.\.venv\Scripts\Activate.ps1
(Si no tienes instaladas las dependencias) pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Health check: http://localhost:8000/health
