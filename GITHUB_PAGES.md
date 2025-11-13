# Publicar no GitHub Pages

## Opção A — Branch `gh-pages` (recomendado)
1. Crie um repositório no GitHub.
2. No repositório local, entre na pasta `client-pages/` e faça o commit dos arquivos.
3. Crie a branch `gh-pages` e faça push:
   ```bash
   git checkout --orphan gh-pages
   git reset --hard
   cp -r ../client-pages/* .
   git add .
   git commit -m "Publish site"
   git push origin gh-pages
   ```
4. No GitHub → *Settings* → *Pages* → *Build and deployment* → *Branch*: selecione `gh-pages` / `root`.
5. Acesse a URL exibida pelo GitHub Pages.
6. **Importante:** edite `client-pages/api.js` (ou este arquivo na `gh-pages`) e substitua a linha:
   ```js
   const API_BASE = 'https://SEU_BACKEND.onrender.com';
   ```
   pela URL pública real do seu backend (Render/Railway).

## Opção B — Pasta `docs/` na branch `main`
1. Copie o conteúdo de `client-pages/` para uma pasta `docs/` na raiz do repositório.
2. GitHub → *Settings* → *Pages* → *Branch*: `main` / `/docs`.
3. Ajuste a mesma linha de `api.js` com a URL pública da sua API.

## Dica
- Se sua API usar outro domínio, ative CORS no backend (o controller já permite `@CrossOrigin(origins = "*")`; troque por seu domínio depois).
