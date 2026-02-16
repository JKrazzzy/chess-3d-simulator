# Chess 3D Simulator

Production-focused 3D chess review app with:

- Polished Three.js board scene (themes, shadows, environment lighting, move highlights)
- Real-time Stockfish analysis via Web Worker (eval bar, best move arrow, move grading)
- Commentary engine that reacts to blunders, tactical moves, and mates
- Firebase Auth + Firestore persistence for saved games

## Tech Stack

- React + TypeScript + Tailwind
- `@react-three/fiber` / `@react-three/drei`
- `chess.js` + Zustand
- Stockfish (worker)
- Firebase (Auth + Firestore)

## Run Locally

```bash
npm install
npm start
```

Build:

```bash
npm run build
```

## Firebase Setup

1. Create a Firebase project.
2. Enable Google Auth provider.
3. Create Firestore database.
4. Copy `.env.example` to `.env` and fill values:

```bash
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

5. Deploy Firestore rules from `firestore.rules`.

If Firebase env vars are missing, app features still run locally except sign-in and cloud saves.

## Notes

- Stockfish runs client-side in `src/workers/stockfish.worker.ts`.
- Real-time analysis can be toggled from the control panel.
- Saved games are available in the **My Games** tab after sign-in.
