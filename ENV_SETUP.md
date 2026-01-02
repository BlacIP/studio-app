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

# Google Auth (local-only)
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
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

# Google Auth (disabled in prod for now)
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
```

---

## How It Works

- API requests hit `/api/*` on the frontend and are rewritten to the Studio API.
- `NEXT_PUBLIC_API_URL` is used by the client-side fetch helper.
  - If set, it takes precedence over rewrites.
- Studio public pages can run in two modes:
  - Path-based (today): `https://studio-app.vercel.app/{studioSlug}/gallery/{clientSlug}`
  - Subdomain (later): `https://{studioSlug}.customdomain.com/gallery/{clientSlug}`

---

## Setup Instructions

1. **Update .env.local**:
   - Set `NEXT_PUBLIC_API_URL` to your local studio-api (e.g. `http://localhost:4000/api`)
   - Set `NEXT_PUBLIC_API_REWRITE_DEST` to `http://localhost:4000`

2. **Verify Production Env**:
   - Set `NEXT_PUBLIC_API_URL` to your deployed studio-api URL (e.g. `https://studio-api.vercel.app/api`)
   - Set `NEXT_PUBLIC_API_REWRITE_DEST` to the base URL (e.g. `https://studio-api.vercel.app`)

3. **Check Studio API Sync Health**:
   - Local: `http://localhost:4000/health`
   - Prod: `https://studio-api.vercel.app/health`
   - The response includes an `outbox` status block (healthy/degraded).

4. **External scheduler (cron-job.org)**:
   - Create a new cron job that calls:
     - Prod: `https://studio-api.vercel.app/api/internal/outbox/process-if-needed`
     - Local (for testing): `http://localhost:4000/api/internal/outbox/process-if-needed`
   - Add request header: `x-admin-sync-secret: <ADMIN_SYNC_SECRET>`
   - Suggested interval: every 10–15 minutes.
   - Optional status check (same header): `https://studio-api.vercel.app/api/internal/outbox/status`

5. **Custom domain (optional)**:
   - Set `CUSTOM_DOMAIN_BASE=customdomain.com` in the studio-app deployment.
   - Set `NEXT_PUBLIC_CUSTOM_DOMAIN_BASE=customdomain.com` so client links use subdomains.
   - Point a wildcard DNS record (`*.customdomain.com`) to Vercel.

6. **Onboarding flow**:
   - After register/login, new studios are routed to `/onboarding` to set the studio name and optional contact details.
   - Completed onboarding redirects to `/dashboard`.

7. **Test**:
   - Run locally: `pnpm dev` → requests should hit the studio API.
