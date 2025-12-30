# Environment Variables Configuration

This file documents the environment variables needed for local development vs production.

---

## Local Development (.env.local)

Create a `.env.local` file in the project root with these variables:

```env
# Environment
NODE_ENV=development

# Studio API
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_REWRITE_DEST=http://localhost:4000
```

---

## Production (.env)

Your production environment should have these variables:

```env
# Environment
NODE_ENV=production

# Studio API
NEXT_PUBLIC_API_URL=https://studio-api.vercel.app/api
NEXT_PUBLIC_API_REWRITE_DEST=https://studio-api.vercel.app
```

---

## How It Works

- API requests hit `/api/*` on the frontend and are rewritten to the Studio API.
- `NEXT_PUBLIC_API_URL` is used by the client-side fetch helper.
  - If set, it takes precedence over rewrites.

---

## Setup Instructions

1. **Update .env.local**:
   - Set `NEXT_PUBLIC_API_URL` to your local studio-api (e.g. `http://localhost:4000/api`)
   - Set `NEXT_PUBLIC_API_REWRITE_DEST` to `http://localhost:4000`

2. **Verify Production Env**:
   - Set `NEXT_PUBLIC_API_URL` to your deployed studio-api URL (e.g. `https://studio-api.vercel.app/api`)
   - Set `NEXT_PUBLIC_API_REWRITE_DEST` to the base URL (e.g. `https://studio-api.vercel.app`)

3. **Test**:
   - Run locally: `pnpm dev` → requests should hit the studio API.
