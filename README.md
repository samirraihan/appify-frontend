# Appify Frontend (React)

This repo contains a React frontend port of the provided HTML/CSS files (Login, Register, Feed).

Quick start:

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your API base (e.g. `http://localhost:8000`).
2. Install and run:

```bash
npm install
npm run dev
```

Notes:
- Uses Vite + React, axios for API calls.
- Auth expects backend routes under `/v1` following the provided Laravel routes. The app stores token in `localStorage` and sends `Authorization: Bearer` header.
- The design and CSS are preserved by reusing the original `assets/css` files.
