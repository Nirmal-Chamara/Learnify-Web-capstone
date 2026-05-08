#!/bin/bash
# ============================================================
#  Learnify — Full Project Scaffold Script
#  Generates both learnify-frontend/ and learnify-backend/
#  Run:  bash setup_learnify.sh
# ============================================================

set -e

echo "🚀 Scaffolding Learnify project structure..."

# ============================================================
# FRONTEND — learnify-frontend/
# ============================================================

echo "📦 Creating frontend structure..."

mkdir -p learnify-frontend/public/assets
mkdir -p learnify-frontend/src/api
mkdir -p learnify-frontend/src/assets/images
mkdir -p learnify-frontend/src/assets/icons
mkdir -p learnify-frontend/src/components/common
mkdir -p learnify-frontend/src/components/layout
mkdir -p learnify-frontend/src/components/chat
mkdir -p learnify-frontend/src/components/scheduler
mkdir -p learnify-frontend/src/components/feedback
mkdir -p learnify-frontend/src/components/dashboard
mkdir -p learnify-frontend/src/contexts
mkdir -p learnify-frontend/src/hooks
mkdir -p learnify-frontend/src/pages/auth
mkdir -p learnify-frontend/src/pages/admin
mkdir -p learnify-frontend/src/store
mkdir -p learnify-frontend/src/utils
mkdir -p learnify-frontend/src/routes

# --- public/ ---
touch learnify-frontend/public/favicon.ico
touch learnify-frontend/public/assets/logo.svg

cat > learnify-frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Learnify</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# --- src/api/ ---
cat > learnify-frontend/src/api/axiosInstance.js << 'EOF'
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — inject JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post('/api/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refresh}` },
        });
        localStorage.setItem('access_token', res.data.access_token);
        return api(error.config);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
EOF

touch learnify-frontend/src/api/authApi.js
touch learnify-frontend/src/api/chatApi.js
touch learnify-frontend/src/api/schedulerApi.js
touch learnify-frontend/src/api/feedbackApi.js
touch learnify-frontend/src/api/resourcesApi.js

# --- src/components/common/ ---
for f in Button Modal LoadingSpinner ErrorMessage Badge Avatar Tooltip ProgressBar; do
  touch "learnify-frontend/src/components/common/${f}.jsx"
done

# --- src/components/layout/ ---
for f in Sidebar Navbar Footer MainLayout; do
  touch "learnify-frontend/src/components/layout/${f}.jsx"
done

# --- src/components/chat/ ---
for f in ChatWindow ChatMessage ChatInput PromptSuggestions ConversationHistory TypingIndicator; do
  touch "learnify-frontend/src/components/chat/${f}.jsx"
done

# --- src/components/scheduler/ ---
for f in TaskCard TaskForm SessionTimer CalendarView ProductivityMeter TrackingStatusBadge AssignmentList; do
  touch "learnify-frontend/src/components/scheduler/${f}.jsx"
done

# --- src/components/feedback/ ---
for f in FeedbackForm StarRating FeedbackCard CategoryFilter SentimentBadge; do
  touch "learnify-frontend/src/components/feedback/${f}.jsx"
done

# --- src/components/dashboard/ ---
for f in ProductivityWidget UpcomingTasksWidget AIInsightsWidget StatsCard; do
  touch "learnify-frontend/src/components/dashboard/${f}.jsx"
done

# --- src/contexts/ ---
touch learnify-frontend/src/contexts/AuthContext.jsx
touch learnify-frontend/src/contexts/ThemeContext.jsx

# --- src/hooks/ ---
for f in useAuth useChat useScheduler useFeedback useTracking useDebounce; do
  touch "learnify-frontend/src/hooks/${f}.js"
done

# --- src/pages/ ---
touch learnify-frontend/src/pages/auth/LoginPage.jsx
touch learnify-frontend/src/pages/auth/RegisterPage.jsx
touch learnify-frontend/src/pages/DashboardPage.jsx
touch learnify-frontend/src/pages/AIChatPage.jsx
touch learnify-frontend/src/pages/SchedulerPage.jsx
touch learnify-frontend/src/pages/ResourcesPage.jsx
touch learnify-frontend/src/pages/FeedbackPage.jsx
touch learnify-frontend/src/pages/ProfilePage.jsx
touch learnify-frontend/src/pages/admin/AdminFeedbackDashboard.jsx
touch learnify-frontend/src/pages/admin/AdminAnalyticsPage.jsx

# --- src/store/ ---
touch learnify-frontend/src/store/index.js
touch learnify-frontend/src/store/authSlice.js
touch learnify-frontend/src/store/chatSlice.js
touch learnify-frontend/src/store/schedulerSlice.js
touch learnify-frontend/src/store/feedbackSlice.js

# --- src/utils/ ---
touch learnify-frontend/src/utils/tokenUtils.js
touch learnify-frontend/src/utils/dateUtils.js
touch learnify-frontend/src/utils/trackingUtils.js
touch learnify-frontend/src/utils/validationUtils.js

# --- src/routes/ ---
cat > learnify-frontend/src/routes/PrivateRoute.jsx << 'EOF'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, roles }) => {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default PrivateRoute;
EOF

touch learnify-frontend/src/routes/AppRoutes.jsx

# --- src/App.jsx & main.jsx ---
cat > learnify-frontend/src/App.jsx << 'EOF'
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
EOF

cat > learnify-frontend/src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
EOF

touch learnify-frontend/src/index.css

# --- Root config files ---
cat > learnify-frontend/.env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

cat > learnify-frontend/vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
EOF

cat > learnify-frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

cat > learnify-frontend/package.json << 'EOF'
{
  "name": "learnify-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.0",
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.0",
    "react-router-dom": "^6.21.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
EOF

cat > learnify-frontend/.gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
EOF

echo "✅ Frontend structure created."

# ============================================================
# BACKEND — learnify-backend/
# ============================================================

echo "🐍 Creating backend structure..."

mkdir -p learnify-backend/app/models
mkdir -p learnify-backend/app/routes
mkdir -p learnify-backend/app/services
mkdir -p learnify-backend/app/middleware
mkdir -p learnify-backend/app/utils
mkdir -p learnify-backend/migrations
mkdir -p learnify-backend/tests

# --- app/__init__.py (Flask App Factory) ---
cat > learnify-backend/app/__init__.py << 'EOF'
from flask import Flask
from app.extensions import db, jwt, migrate
from app.routes import auth, chat, scheduler, tracking, feedback, resources, admin, notifications
from app.config import config
from app.middleware.error_handler import register_error_handlers


def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(auth.bp,          url_prefix="/api/auth")
    app.register_blueprint(chat.bp,          url_prefix="/api/chat")
    app.register_blueprint(scheduler.bp,     url_prefix="/api/scheduler")
    app.register_blueprint(tracking.bp,      url_prefix="/api/tracking")
    app.register_blueprint(feedback.bp,      url_prefix="/api/feedback")
    app.register_blueprint(resources.bp,     url_prefix="/api/resources")
    app.register_blueprint(admin.bp,         url_prefix="/api/admin")
    app.register_blueprint(notifications.bp, url_prefix="/api/notifications")

    register_error_handlers(app)
    return app
EOF

# --- app/config.py ---
cat > learnify-backend/app/config.py << 'EOF'
import os

class BaseConfig:
    SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 900       # 15 minutes
    JWT_REFRESH_TOKEN_EXPIRES = 604800   # 7 days

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/learnify"
    )

class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
EOF

# --- app/extensions.py ---
cat > learnify-backend/app/extensions.py << 'EOF'
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
EOF

# --- app/models/ ---
touch learnify-backend/app/models/__init__.py

for model in user task work_session tracking_record chat_session chat_message feedback resource notification; do
  touch "learnify-backend/app/models/${model}.py"
done

cat > learnify-backend/app/models/user.py << 'EOF'
from app.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email         = db.Column(db.String(255), unique=True, nullable=False)
    username      = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role          = db.Column(db.Enum("student", "admin"), default="student")
    is_active     = db.Column(db.Boolean, default=True)
    avatar_url    = db.Column(db.String(500))
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"
EOF

# --- app/routes/ ---
touch learnify-backend/app/routes/__init__.py

for route in auth chat scheduler tracking feedback resources admin notifications; do
  cat > "learnify-backend/app/routes/${route}.py" << EOF
from flask import Blueprint

bp = Blueprint("${route}", __name__)

# TODO: Add ${route} routes here
EOF
done

# --- app/services/ ---
touch learnify-backend/app/services/auth_service.py

cat > learnify-backend/app/services/ai_service.py << 'EOF'
import os
from openai import OpenAI
from app.models.chat_message import ChatMessage

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = (
    "You are Learnify's academic assistant. Help university students with "
    "study planning, coursework questions, scheduling advice, and productivity. "
    "Be concise, encouraging, and professional."
)

def get_ai_response(user_message: str, session_id: int, user_id: int) -> str:
    history = (
        ChatMessage.query
        .filter_by(session_id=session_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(20)
        .all()
    )
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=1024,
        temperature=0.7,
    )
    return response.choices[0].message.content
EOF

cat > learnify-backend/app/services/tracking_engine.py << 'EOF'
from datetime import datetime
from app.models.work_session import WorkSession
from app.models.task import Task


def compute_session_status(session: WorkSession) -> str:
    now = datetime.utcnow()

    if session.scheduled_start > now:
        return "PENDING"

    task = Task.query.get(session.task_id)

    if task.progress_percent == 100 or task.is_submitted:
        return "COMPLETED"

    if session.actual_start and not session.actual_end:
        return "IN_PROGRESS"

    if session.scheduled_end < now:
        if not session.actual_start:
            return "MISSED"
        time_ratio = session.time_spent_minutes / max(session.duration_minutes, 1)
        if task.progress_percent >= 80 and time_ratio >= 0.7:
            return "COMPLETED"
        elif task.progress_percent > 0 or time_ratio >= 0.3:
            return "PARTIALLY_WORKED"
        else:
            return "MISSED"

    return "PENDING"
EOF

cat > learnify-backend/app/services/sentiment_service.py << 'EOF'
import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_sentiment(text: str) -> dict:
    prompt = (
        "Analyze the sentiment of the following student feedback. "
        "Return only a JSON object with keys: "
        "sentiment (Positive/Neutral/Negative) and confidence (0.0 to 1.0).\n\n"
        f"Feedback: {text}"
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)
EOF

touch learnify-backend/app/services/notification_service.py
touch learnify-backend/app/services/analytics_service.py

# --- app/middleware/ ---
cat > learnify-backend/app/middleware/rbac_middleware.py << 'EOF'
from functools import wraps
from flask_jwt_extended import get_jwt
from flask import jsonify


def role_required(role: str):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") != role:
                return jsonify({"success": False, "error": "Forbidden"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
EOF

touch learnify-backend/app/middleware/auth_middleware.py
touch learnify-backend/app/middleware/rate_limiter.py

cat > learnify-backend/app/middleware/error_handler.py << 'EOF'
from flask import jsonify


def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"success": False, "error": {"code": "BAD_REQUEST", "message": str(e)}}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Authentication required"}}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"success": False, "error": {"code": "FORBIDDEN", "message": "Access denied"}}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Resource not found"}}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"success": False, "error": {"code": "SERVER_ERROR", "message": "Internal server error"}}), 500
EOF

# --- app/utils/ ---
touch learnify-backend/app/utils/validators.py
touch learnify-backend/app/utils/date_utils.py

cat > learnify-backend/app/utils/response_utils.py << 'EOF'
from flask import jsonify


def success_response(data=None, message="Request processed successfully", status=200, pagination=None):
    payload = {"success": True, "message": message, "data": data}
    if pagination:
        payload["pagination"] = pagination
    return jsonify(payload), status


def error_response(code, message, field=None, status=400):
    error = {"code": code, "message": message}
    if field:
        error["field"] = field
    return jsonify({"success": False, "error": error}), status
EOF

touch learnify-backend/app/utils/pagination.py

# --- tests/ ---
for t in test_auth test_chat test_scheduler test_tracking test_feedback; do
  touch "learnify-backend/tests/${t}.py"
done

# --- Root backend files ---
cat > learnify-backend/.env << 'EOF'
FLASK_ENV=development
DATABASE_URL=mysql+pymysql://learnify_user:password@localhost:3306/learnify
OPENAI_API_KEY=your-openai-api-key-here
JWT_SECRET_KEY=your-256-bit-secret-here
DB_PASSWORD=password
EOF

cat > learnify-backend/requirements.txt << 'EOF'
Flask==3.0.0
Flask-JWT-Extended==4.6.0
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.5
Flask-Bcrypt==1.0.1
Flask-CORS==4.0.0
Flask-Limiter==3.5.0
SQLAlchemy==2.0.23
PyMySQL==1.1.0
openai==1.6.1
APScheduler==3.10.4
marshmallow==3.20.1
gunicorn==21.2.0
python-dotenv==1.0.0
pytest==7.4.3
EOF

cat > learnify-backend/wsgi.py << 'EOF'
from app import create_app

app = create_app("production")

if __name__ == "__main__":
    app.run()
EOF

cat > learnify-backend/run.py << 'EOF'
from app import create_app

app = create_app("development")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
EOF

cat > learnify-backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "wsgi:app"]
EOF

cat > learnify-backend/.gitignore << 'EOF'
__pycache__/
*.pyc
*.pyo
.env
venv/
.venv/
instance/
EOF

# ============================================================
# ROOT — docker-compose.yml & README
# ============================================================

echo "🐳 Creating docker-compose.yml..."

cat > docker-compose.yml << 'EOF'
version: "3.9"

services:
  frontend:
    build: ./learnify-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://api:5000/api
    depends_on:
      - api

  api:
    build: ./learnify-backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=mysql+pymysql://learnify_user:${DB_PASSWORD}@db:3306/learnify
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - FLASK_ENV=production
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=learnify
      - MYSQL_USER=learnify_user
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - frontend
      - api

volumes:
  db_data:
EOF

cat > .env << 'EOF'
OPENAI_API_KEY=your-openai-api-key-here
JWT_SECRET_KEY=your-256-bit-secret-here
DB_PASSWORD=your-db-password-here
EOF

cat > .gitignore << 'EOF'
.env
node_modules/
__pycache__/
*.pyc
dist/
.DS_Store
certs/
EOF

cat > README.md << 'EOF'
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
EOF

echo ""
echo "✅ Learnify scaffold complete!"
echo ""
echo "📁 Structure created:"
echo "   learnify-frontend/   — React + Vite + Tailwind"
echo "   learnify-backend/    — Flask + SQLAlchemy + JWT"
echo "   docker-compose.yml   — Full stack Docker setup"
echo "   README.md            — Setup instructions"
echo ""
echo "🚀 Next steps:"
echo "   1. cd into the project root"
echo "   2. git init && git add . && git commit -m 'Initial scaffold'"
echo "   3. git remote add origin https://github.com/YOUR_ORG/learnify.git"
echo "   4. git push -u origin main"
