# Convex setup

1. Run `npx convex dev` and create or select the Unoforce project.
2. Keep the generated `.env.local` private. Never commit its values.
3. Run `npx convex dev --once` after schema or function changes.
4. Add `NEXT_PUBLIC_CONVEX_URL` to the linked Vercel project.

The public preview remains usable with fictional browser-local data when Convex is not configured. It must label that fallback honestly and must not claim cloud persistence.
