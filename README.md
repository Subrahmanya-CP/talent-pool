# Talent Pool Search Platform

A recruiter-focused talent platform for uploading resumes, extracting candidate data with AI, and searching candidates efficiently.

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MVC Architecture

### Database
- Supabase PostgreSQL

### Storage
- AWS S3

### AI
- Groq API (Llama 3.3 70B)

## Project Structure

```
tech-assist-project/
├── backend/
│   ├── config/        # External service configuration
│   ├── controllers/   # Request handlers
│   ├── database/      # Supabase queries
│   ├── middleware/    # Validation and error handling
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic
│   ├── utils/         # Helpers and parsers
│   └── validators/    # Joi validation schemas
├── frontend/
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Route-level pages
│   ├── services/      # API clients and services
│   └── utils/         # Frontend utilities
├── supabase/          # Database schema and migration SQL
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Supabase project and keys
- AWS S3 bucket and credentials
- Groq API key

### Backend Setup

1. Open the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template:
```bash
cp .env.example .env
```

4. Update `.env` with:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET`
   - `GROQ_API_KEY`
   - `FRONTEND_URL` (optional, default `http://localhost:5173`)

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Open the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template:
```bash
cp .env.example .env
```

4. Update `.env` if needed:
   - `VITE_API_URL` (default `http://localhost:5000/api`)

5. Start the frontend app:
```bash
npm run dev
```

## Testing

### Backend Tests

Run the backend test suite:
```bash
cd backend
npm test
```

### Frontend Tests

Run the frontend test suite:
```bash
cd frontend
npm test
```

### Build Verification

Build the frontend for production:
```bash
cd frontend
npm run build
```

## API Endpoints

- `POST /api/resumes/upload` - Upload resumes and parse candidate data
- `GET /api/candidates` - List candidates with optional filters
- `GET /api/candidates/:id` - Candidate details
- `GET /api/analytics` - Analytics dashboard data
- `GET /health` - Backend health check

## Architecture Overview

### Backend (MVC Pattern)

- **Controllers**: Handle HTTP requests and send JSON responses
- **Routes**: Map endpoints to controllers
- **Services**: Hold business rules and reusable logic
- **Middleware**: Validate uploads and handle errors
- **Config**: Load environment and external service clients
- **Utils**: Helper functions for parsing, scraping, and formatting

### Frontend

- **Components**: UI building blocks
- **Pages**: Route-level views
- **Hooks**: Data fetching and state management
- **Services**: API request wrappers
- **Utils**: Client-side helpers

## Security Features

- Resume file type validation (PDF/DOCX only)
- Upload limits and request rate limiting
- Helmet security headers
- CORS configuration
- Sanitize PII before sending text to AI
- Environment variable validation

## Deployment Checklist

1. Confirm backend `.env` is configured properly
2. Confirm frontend `.env` uses correct API URL
3. Run backend tests: `cd backend && npm test`
4. Run frontend build: `cd frontend && npm run build`
5. Start the backend and verify `GET /health`
6. Deploy static frontend assets and backend server to your environment

## Notes

- The backend uses Supabase for storage and querying
- The frontend uses `axios` with `VITE_API_URL` for API communication
- AI parsing and scoring use the Groq API
- The frontend production build is verified and ready for deployment
