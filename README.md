# Learnify — Student Productivity Platform

React.js · Flask · MySQL · OpenAI API

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/your-org/learnify.git
cd learnify
```

### 2. Set environment variables
```bash
cp .env.example .env
# Fill in OPENAI_API_KEY, JWT_SECRET_KEY, DB_PASSWORD
```

### 3. Run with Docker Compose
```bash
docker-compose up --build
```

### 4. Local development (without Docker)

**Frontend:**
```bash
cd learnify-frontend
npm install
npm run dev
```

**Backend:**
```bash
cd learnify-backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
python run.py
```

## Project Structure
- `learnify-frontend/` — React 18 + Vite + Tailwind CSS SPA
- `learnify-backend/` — Flask 3 REST API with JWT auth
- `docker-compose.yml` — Full stack orchestration
