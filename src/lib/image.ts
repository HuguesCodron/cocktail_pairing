/**
 * Returns an image URL for a cocktail.
 *
 * If OPENROUTER_API_KEY is set, generates an image with FLUX via OpenRouter
 * using its OpenAI-compatible chat completions endpoint (with `modalities:
 * ["image"]`) keyed off the cocktail's visualDescription. On any failure
 * (auth, moderation, network, missing image in the response) we fall back to
 * a placeholder so the page still renders.
 *
 * Env:
 *   OPENROUTER_API_KEY      Required to enable image generation.
 *   OPENROUTER_FLUX_MODEL   Optional override, e.g. black-forest-labs/flux.2-klein-4b
 */

import OpenAI from 'openai';

const DEFAULT_FLUX_MODEL = 'black-forest-labs/flux.2-klein-4b';

function placeholderUrl(label: string): string {
  const text = encodeURIComponent(label.slice(0, 28));
  return `https://placehold.co/800x800/EBD9E8/2D2438/png?text=${text}`;
}

export async function getCocktailImage(opts: {
  label: string;
  visualDescription: string;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return placeholderUrl(opts.label);
  }

  try {
    return await generateWithFlux({ apiKey, visualDescription: opts.visualDescription });
  } catch (err) {
    console.error('[image] OpenRouter FLUX generation failed; using placeholder.', err);
    return placeholderUrl(opts.label);
  }
}

type FluxResponse = {
  choices?: Array<{
    message?: { images?: Array<{ image_url?: { url?: string } }> };
  }>;
};

async function generateWithFlux(opts: {
  apiKey: string;
  visualDescription: string;
}): Promise<string> {
  const openrouter = new OpenAI({
    apiKey: opts.apiKey,
    baseURL: 'https://openrouter.ai/api/v1'
  });
  const model = process.env.OPENROUTER_FLUX_MODEL ?? DEFAULT_FLUX_MODEL;

  const prompt =
    `Editorial cocktail photography. ${opts.visualDescription} ` +
    'Shallow depth of field, warm natural light, clean styled composition, magazine quality, no text, no watermark.';

  // OpenRouter accepts `modalities: ['image']` as an extension on top of
  // OpenAI's chat schema. The SDK's type only permits 'text' | 'audio', so
  // we cast through unknown.
  const request = {
    model,
    messages: [{ role: 'user', content: prompt }],
    modalities: ['image']
  } as unknown as Parameters<typeof openrouter.chat.completions.create>[0];

  const result = (await openrouter.chat.completions.create(request)) as unknown as FluxResponse;

  const url = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url) {
    throw new Error('OpenRouter FLUX response did not include an image URL.');
  }
  return url;
}
