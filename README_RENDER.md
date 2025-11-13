# Deploy no Render — API Java (Spring Boot)

## Passo a passo
1. **Renomeado automaticamente**: este pacote já traz `backend/Dockerfile` pronto para o Render.
2. Faça push do repositório no GitHub (com toda a pasta `backend/`).
3. Acesse https://render.com → **New +** → **Web Service**.
4. Conecte seu GitHub e selecione o repositório.
5. Escolha **Deploy from Docker** (Render detecta o `backend/Dockerfile`).
6. **Environment**: defina se necessário as variáveis do banco:
   - `SPRING_DATASOURCE_URL` — `jdbc:postgresql://HOST:5432/DB`
   - `SPRING_DATASOURCE_USERNAME` — usuário do banco
   - `SPRING_DATASOURCE_PASSWORD` — senha do banco
7. Clique em **Create Web Service** e aguarde o build/deploy.
8. Teste: acesse `https://SEU_APP.onrender.com/actuator/health` → deve retornar `{ "status": "UP" }`.

## Dicas importantes
- O Render injeta a variável `PORT`; o Dockerfile já roda com `--server.port=${PORT}`.
- Se usar banco externo (Neon/Supabase), cole as credenciais nas variáveis de ambiente.
- Para evitar CORS, depois troque `@CrossOrigin("*")` pelo domínio do seu GitHub Pages.
- Se a primeira chamada ficar lenta, é normal (plano free hiberna quando inativo).

## Conectar com o Frontend (GitHub Pages)
- Edite `client-pages/api.js` e defina:
  ```js
  const API_BASE = 'https://SEU_APP.onrender.com';
  ```
- Publique `client-pages/` no **GitHub Pages** (branch `gh-pages` ou pasta `docs/`).

Boa publicação! 🚀


## URL pública do backend
Este pacote já está configurado para usar:

```
https://api-java-copilot.onrender.com
```

Se o nome do serviço no Render for diferente, edite `client-pages/api.js` e ajuste `API_BASE`.