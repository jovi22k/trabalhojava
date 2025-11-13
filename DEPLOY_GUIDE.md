# Guia de Deploy Gratuito — Render / Railway / Fly.io

Este guia explica, passo a passo, como publicar sua **API Java (Spring Boot)** gratuitamente e obter a **URL pública**.

---

## 1) Deploy no Render (recomendado pela simplicidade)

### Pré-requisitos
- Conta no GitHub e Render (login com GitHub)
- Repositório com a pasta `backend/` contendo `Dockerfile_render` (ou seu `Dockerfile` padrão)

### Passos
1. Faça push do seu projeto para o GitHub.
2. Em https://render.com → **New +** → **Web Service**.
3. Selecione seu repositório.
4. Escolha **Deploy from Docker** e aponte para o arquivo `backend/Dockerfile_render` (renomeie-o para `Dockerfile` ou indique o caminho).
5. Configure variáveis de ambiente (opcional, se usar banco gerenciado):
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
6. Clique em **Create Web Service** e aguarde o build.
7. Ao final, pegue a URL gerada (ex.: `https://sua-api.onrender.com`).  
   - Teste: `https://sua-api.onrender.com/actuator/health` deve retornar `"status":"UP"`.

### Banco de Dados
- Para usar PostgreSQL localmente: já há `docker-compose.yml`.
- Para produção, use um Postgres gerenciado (Render tem add-on pago) ou serviços como **Neon**, **Supabase** (há camadas gratuitas).
- Ajuste as variáveis no Render para apontar seu banco.

### CORS
- No exemplo, o controller usa `@CrossOrigin(origins = "*")`.  
- Em produção, troque `*` pelo domínio do seu **GitHub Pages**.

---

## 2) Deploy no Railway (simples e estável)

### Passos
1. https://railway.app → **New Project → Deploy from GitHub**.
2. Selecione o repositório.
3. Railway detecta o Docker automaticamente se existir `backend/Dockerfile_railway` (renomeie para `Dockerfile`).
4. Configure variáveis de ambiente do banco se necessário.
5. Aguarde o deploy e copie a URL (ex.: `https://api-java-production.up.railway.app`).  
   - Teste: `https://.../actuator/health`

### Banco integrado
- Railway permite criar um **PostgreSQL** dentro do mesmo projeto (free tier) → conecte via env vars.

---

## 3) Deploy no Fly.io (via CLI, para quem quer mais controle)

### Instalação e login
```bash
curl -L https://fly.io/install.sh | sh
fly auth signup
```

### Deploy
```bash
cd backend
# Crie fly.toml (modelo incluído neste pacote)
fly launch --now
# (Responda as perguntas; ele cria o app e sobe a imagem)
```
- Depois de subir, pegue a URL (ex.: `https://api-java-copilot.fly.dev`).

---

## Variáveis de Ambiente (todas as plataformas)
- `SPRING_DATASOURCE_URL` → `jdbc:postgresql://<host>:<port>/<db>`
- `SPRING_DATASOURCE_USERNAME` → usuário
- `SPRING_DATASOURCE_PASSWORD` → senha
- `PORT` → a plataforma injeta automaticamente (o `Dockerfile` já usa `--server.port=${PORT}`).

**Importante:** No `application.properties` já usamos placeholders para essas variáveis.

---

## Pós-deploy (ligar com o Frontend — GitHub Pages)

1. Abra `client-pages/api.js` e substitua:
   ```js
   const API_BASE = 'https://SEU_BACKEND.onrender.com';
   ```
   pela **URL pública real**.
2. Publique o front no GitHub Pages: branch `gh-pages` ou `docs/` (veja `GITHUB_PAGES.md`).
3. Teste a página do GitHub Pages e verifique as requisições no DevTools (aba Network).

---

## Dicas finais
- Se a API retornar CORS error, restrinja/ajuste o `@CrossOrigin` com o domínio do seu Pages.
- Se a plataforma “hibernar” apps free, a primeira chamada pode demorar (frio). Faça uma chamada de “aquecimento”.
- Sempre valide `/actuator/health` antes de apontar o front para a API.
