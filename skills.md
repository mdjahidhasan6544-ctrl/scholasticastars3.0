# scholastica3.0 Skills Reference

This file is the project-specific implementation guide for `scholastica3.0`. It is derived from the authoritative guidance already present in this repository:

- `AGENTS.md`
- `antigravity-orchestrator/SKILL_antigravity-orchestrator.md`
- `frontend-design/SKILL_frontend-design.md`
- `web-artifacts-builder/SKILL_web-artifacts-builder.md`

## Core Architecture Philosophy

1. **Backend-first delivery**
   - The backend must be deployable and testable on its own before the frontend is connected.
   - The frontend consumes only a deployed API URL via environment variables.

2. **Modular, deterministic server design**
   - `routes/` wire endpoints only.
   - `controllers/` handle HTTP concerns.
   - `services/` own reusable business logic.
   - `models/` define data contracts.
   - `middleware/` centralizes validation, logging, 404 handling, and errors.
   - `config/` owns environment and database concerns.

3. **Environment-driven configuration**
   - Never hardcode secrets.
   - MongoDB Atlas must be provided through `MONGO_URI`.
   - Frontend API access must be provided through `VITE_API_URL`.

4. **Consistent API behavior**
   - Use structured success/error responses.
   - Validate incoming requests before controller logic runs.
   - Use centralized error handling instead of ad-hoc `try/catch` responses everywhere.

5. **Operational readiness**
   - Include a health endpoint for Render deployment checks.
   - Log request and startup lifecycle events in a structured, readable format.
   - Fail fast when critical configuration is missing.

## Backend Standards

- Use `async/await` throughout.
- Keep controllers small by delegating reusable data logic to services.
- Use `express-validator` for request validation.
- Use `helmet`, `cors`, JSON parsing, and centralized error handling.
- Prefer clean, explicit field names and scalable document structures.
- Return JSON in a predictable shape:
  - success responses include `success`, `message`, `data`, and optional `meta`
  - error responses include `success`, `message`, and optional `details`

## Frontend Standards

- Use React with Vite.
- Keep the frontend separated into `components/`, `pages/`, and `services/`.
- All API calls flow through `src/services/api.js`.
- Never ship localhost fallbacks.
- Handle loading, empty, success, and failure states intentionally.
- Use a distinctive visual direction instead of a generic dashboard aesthetic.

## Design Direction

- Theme: **editorial academic + cosmic premium dashboard**
- Avoid generic fonts like Inter/Arial.
- Use a high-contrast dark surface with refined accent colors.
- Build a UI that feels purposeful, trustworthy, and memorable.

## Deployment Rules

1. Deploy backend to Render Web Service first.
2. Test `GET /api/health` on the deployed backend.
3. Configure `VITE_API_URL` with the deployed backend URL.
4. Deploy frontend to Render Static Site second.
5. Do not couple the frontend to local backend assumptions.
