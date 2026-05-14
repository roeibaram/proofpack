# ProofPack

ProofPack is a full-stack case and evidence tracker for document-heavy workflows like immigration packages, insurance claims, apartment applications, and tax prep.

The V1 app lets a signed-in user:

- create and manage packages
- add document checklist items manually
- organize documents by category
- track missing, requested, and received items
- monitor checklist progress from a dashboard

## Stack

Frontend:
- React
- Vite
- Context API
- CSS with BEM-style class naming

Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Project structure

- `src/` React app
- `public/` static files
- `server/` Express API
- root `package.json` for everything

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Create env files:

- root `.env` is already included for local dev
- use `.env.example` if you want to recreate it later

3. Start MongoDB locally, then run:

```bash
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)  
API: [http://localhost:5002](http://localhost:5002)

## VS Code note

This workspace hides `node_modules` and `dist` in the explorer through [.vscode/settings.json](/Users/roeibaram/projects/proofpack/.vscode/settings.json) so the project looks like a normal app when you open it.

## API routes

Public:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`

Protected:
- `GET /api/auth/me`
- `GET /api/cases`
- `POST /api/cases`
- `PUT /api/cases/:caseId`
- `DELETE /api/cases/:caseId`
- `POST /api/cases/:caseId/documents`
- `PUT /api/cases/:caseId/documents/:documentId`
- `DELETE /api/cases/:caseId/documents/:documentId`
