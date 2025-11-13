# API Java + Frontend Estático

## Como rodar localmente
1. Requisitos: Java 21, Maven, Docker (opcional), Node não é necessário.
2. Backend (sem Docker):
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   - A API sobe em `http://localhost:8080`.
3. Frontend (estático):
   - Abra `client-pages/index.html` no navegador.
   - Edite `client-pages/api.js` e ajuste `API_BASE` para apontar para sua API.
4. Com Docker (dev):
   ```bash
   cd backend
   docker compose up -d --build
   ```
   - API em `http://localhost:8080`
   - Postgres em `localhost:5432` (user: app, pass: app, db: appdb)

## Deploy
- Backend: publicar imagem no GHCR e usar Render/Railway/Fly.io.
- Frontend: publicar pasta `client-pages/` no GitHub Pages (branch `gh-pages` ou raiz `docs/`).

## Endpoints principais
- `GET /api/v1/produtos`
- `POST /api/v1/produtos` (body: `{ "nome": "Ex", "preco": 10.0 }`)
- `PUT /api/v1/produtos/{id}`
- `DELETE /api/v1/produtos/{id}`
- Swagger UI: `/swagger-ui.html`
- Health: `/actuator/health`
