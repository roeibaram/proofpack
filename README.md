# ProofPack

ProofPack is a full-stack case and evidence tracker for document-heavy workflows like immigration packages, insurance claims, apartment applications, and tax prep.

The V1 app lets a signed-in user:

- create and manage packages
- add document checklist items manually
- organize documents by category
- track missing, requested, and received items
- monitor checklist progress from a dashboard
- schedule follow-up dates for folders and evidence slips
- sort urgent work to the front of the filing drawer

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

## Seed demo data

To load a ready-made demo account with three realistic folders:

```bash
npm run seed
```

Demo credentials:

- email: `demo@proofpack.local`
- password: `ProofPack123`

The seed script replaces any previous demo folders for that account so you can rerun it safely.

## Quick manual test

1. Run `npm run seed`
2. Run `npm run dev`
3. Sign in with the demo account
4. Open each folder and confirm the timeline, progress bar, and follow-up labels render
5. Create a new folder and add a new evidence slip with a follow-up date
6. Change the drawer sort mode to `Nearest follow-up` and `Most open items`
7. Edit and delete one evidence slip to confirm the timeline updates
8. Log out and back in to confirm data persists

## Useful scripts

- `npm run dev` starts the React app and Express API together
- `npm run server` starts only the backend
- `npm run seed` loads demo data into MongoDB
- `npm run lint` runs ESLint
- `npm run build` creates the production frontend bundle

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
