# Pour & Plate

Tell us what you're cooking, get one cocktail and one alcohol-free pairing back.

## Setup

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

### Optional: cocktail images via FLUX 2 Pro

Add `BFL_API_KEY` to `.env.local` and each pairing will include a generated image keyed off the cocktail's `visualDescription`. Without the key, the app uses placeholder images — everything else still works.

If BFL changes the endpoint, override it without touching code:

```
FLUX_ENDPOINT=https://api.bfl.ai/v1/<correct-path>
```

Image generation is parallelized across the two cocktails and capped at ~30s. On timeout, auth failure, or moderation, the route falls back to a placeholder for that drink — the response itself does not fail.

## Architecture

- **`src/app/api/pair/route.ts`** — server route. Calls Claude Sonnet 4.6 via tool use, validates with Zod, attaches placeholder image URLs.
- **`src/lib/prompts.ts`** — system prompt and user-prompt builder. The builder takes an options bag so adding `complexity` or `spiritBase` is a one-line schema change.
- **`src/lib/schema.ts`** — single source of truth. Discriminated union: `pairing` (alcoholic + non-alcoholic) or `off_topic`.
- **`src/lib/image.ts`** — placeholder image source. The `visualDescription` is already piped through, so swapping in a real generator (Replicate, Unsplash search, Anthropic image gen) is one function.
- **`src/components/pairing-form.tsx`** — owns input + loading/error/success state.
- **`src/components/cocktail-card.tsx`** — presentational.

## Extending later

- **Complexity / spirit-base selectors:** add fields to `RequestBody` (route), to `buildUserPrompt` (prompts), and to the form. The system prompt and tool schema don't need to change.
- **Real images:** swap `getCocktailImage` in [`src/lib/image.ts`](src/lib/image.ts).
