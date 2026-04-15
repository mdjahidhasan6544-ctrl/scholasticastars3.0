# scholasticastars3.0

Production-ready rebuild of ScholasticaStars with a **backend-first deployment flow**, a standalone Express + MongoDB Atlas API, and a React + Vite dashboard that connects only to a deployed backend.

## Mandatory project guidance

This project includes a root-level `skills.md` and it must remain the primary implementation reference for:

- architecture patterns
- coding standards
- folder structure
- reusable services/utilities
- deployment behavior

The file was authored from the repository’s authoritative skill sources and then localized for `scholastica3.0`.

## Project structure

```text
scholastica3.0/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
├── server.js
├── skills.md
├── .env.example
└── README.md
```

## Backend stack

- Node.js
- Express.js
- MongoDB Atlas via Mongoose

## Frontend stack

- React
- Vite

## Environment variables

### Root backend env (`.env`)

Copy `.env.example` to `.env` and set real values:

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-uri
CLIENT_URL=*
NODE_ENV=development
```

### Frontend env (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## Local setup

### 1. Install backend dependencies

From the `scholastica3.0/` directory:

```bash
npm install
```

### 2. Install frontend dependencies

From the `scholastica3.0/frontend/` directory:

```bash
npm install
```

### 3. Start backend

From the `scholastica3.0/` directory:

```bash
npm start
```

### 4. Start frontend

From the `scholastica3.0/frontend/` directory:

```bash
npm run dev
```

> The frontend is designed to call the URL in `VITE_API_URL`. For production use, point it to the deployed Render backend.

## Backend-first deployment guide

This order is mandatory.

### Phase 1 — Deploy backend first

Create a **Render Web Service** for the `scholastica3.0/` root.

- **Build command:** `npm install`
- **Start command:** `node server.js`

Set these Render environment variables:

- `PORT=5000`
- `MONGO_URI=<your MongoDB Atlas URI>`
- `CLIENT_URL=*`
- `NODE_ENV=production`

### Phase 2 — Test backend independently

After deployment, verify:

```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Scholastica 3.0 backend is healthy",
  "data": {
    "status": "ok",
    "uptime": 123.45,
    "timestamp": "2026-01-01T00:00:00.000Z",
    "service": "scholastica3.0-api"
  }
}
```

### Phase 3 — Deploy frontend second

Create a **Render Static Site** for `scholastica3.0/frontend`.

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Set:

- `VITE_API_URL=https://your-backend-url.onrender.com`

The frontend must connect only to the deployed backend URL.

## API endpoints

### Health check

- `GET /api/health`

### Courses CRUD

- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`

## API usage examples

### Create a course

```bash
curl -X POST https://your-backend-url.onrender.com/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Higher Mathematics Intensive",
    "description": "An advanced, exam-ready learning path for senior students.",
    "category": "STEM",
    "instructor": "Dr. Ayesha Rahman",
    "type": "paid",
    "price": 89,
    "durationInHours": 24,
    "thumbnailUrl": "https://images.example.com/higher-math.jpg",
    "order": 1,
    "isPublished": true
  }'
```

### Fetch all courses

```bash
curl https://your-backend-url.onrender.com/api/courses
```

### Update a course

```bash
curl -X PUT https://your-backend-url.onrender.com/api/courses/<course-id> \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Higher Mathematics Intensive",
    "description": "Updated description for the latest cohort.",
    "category": "STEM",
    "instructor": "Dr. Ayesha Rahman",
    "type": "paid",
    "price": 99,
    "durationInHours": 26,
    "thumbnailUrl": "https://images.example.com/higher-math.jpg",
    "order": 1,
    "isPublished": true
  }'
```

### Delete a course

```bash
curl -X DELETE https://your-backend-url.onrender.com/api/courses/<course-id>
```

## Notes

- MongoDB Atlas is required.
- `MONGO_URI` is never hardcoded in application logic.
- CORS is enabled and defaults to `*` when `CLIENT_URL=*`.
- The backend runs independently of the frontend.
- The frontend intentionally avoids a localhost fallback in shipped code.
