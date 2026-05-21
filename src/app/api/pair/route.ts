import { NextResponse } from 'next/server';
import { z } from 'zod';
import type Anthropic from '@anthropic-ai/sdk';
import { getAnthropicClient, MODEL } from '@/lib/anthropic';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { PairingResponseSchema } from '@/lib/schema';
import { getCocktailImage } from '@/lib/image';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RequestBody = z.object({
  dish: z.string().trim().min(1).max(240)
});

const cocktailToolShape = {
  type: 'object' as const,
  properties: {
    name: { type: 'string', description: 'Cocktail name.' },
    rationale: {
      type: 'string',
      description: 'One sentence under 240 characters using concrete flavor logic.',
      maxLength: 240
    },
    ingredients: {
      type: 'array',
      minItems: 2,
      maxItems: 10,
      items: {
        type: 'object',
        properties: {
          item: { type: 'string' },
          amount: {
            type: 'string',
            description: 'Use ml, g, or counts. Never ounces.'
          }
        },
        required: ['item', 'amount']
      }
    },
    instructions: {
      type: 'array',
      minItems: 2,
      maxItems: 8,
      items: { type: 'string', description: 'Short imperative step.' }
    },
    garnish: { type: 'string' },
    visualDescription: {
      type: 'string',
      description: 'Glassware, color, garnish, and mood. 1–2 sentences.'
    }
  },
  required: ['name', 'rationale', 'ingredients', 'instructions', 'garnish', 'visualDescription']
};

const tools: Anthropic.Tool[] = [
  {
    name: 'pair_cocktails',
    description:
      'Return a paired alcoholic cocktail and non-alcoholic alternative for the given dish.',
    input_schema: {
      type: 'object',
      properties: {
        dish: { type: 'string', description: "The user's dish, normalized." },
        alcoholic: cocktailToolShape,
        nonAlcoholic: cocktailToolShape
      },
      required: ['dish', 'alcoholic', 'nonAlcoholic']
    }
  },
  {
    name: 'flag_off_topic',
    description:
      'Use when the input is not food. Return a brief, warm message reminding the user this app only pairs cocktails with food.',
    input_schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = RequestBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Tell us what you are cooking — a dish name works best.' },
      { status: 400 }
    );
  }

  const { dish } = parsed.data;

  let toolUse:
    | { name: 'pair_cocktails' | 'flag_off_topic'; input: unknown }
    | null = null;

  try {
    const client = getAnthropicClient();
    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      tools,
      tool_choice: { type: 'any' },
      messages: [{ role: 'user', content: buildUserPrompt({ dish }) }]
    });

    for (const block of result.content) {
      if (block.type === 'tool_use') {
        if (block.name === 'pair_cocktails' || block.name === 'flag_off_topic') {
          toolUse = { name: block.name, input: block.input };
          break;
        }
      }
    }
  } catch (err) {
    console.error('[pair] anthropic error', err);
    return NextResponse.json(
      { error: 'The bartender is unavailable. Try again in a moment.' },
      { status: 502 }
    );
  }

  if (!toolUse) {
    return NextResponse.json(
      { error: 'The model returned no structured output.' },
      { status: 502 }
    );
  }

  const normalized =
    toolUse.name === 'pair_cocktails'
      ? { kind: 'pairing' as const, ...(toolUse.input as object) }
      : { kind: 'off_topic' as const, ...(toolUse.input as object) };

  const validated = PairingResponseSchema.safeParse(normalized);
  if (!validated.success) {
    console.error('[pair] schema validation failed', validated.error.flatten());
    return NextResponse.json(
      { error: 'The model returned malformed output.' },
      { status: 502 }
    );
  }

  if (validated.data.kind === 'off_topic') {
    return NextResponse.json(validated.data);
  }

  const [alcImage, naImage] = await Promise.all([
    getCocktailImage({
      label: validated.data.alcoholic.name,
      visualDescription: validated.data.alcoholic.visualDescription
    }),
    getCocktailImage({
      label: validated.data.nonAlcoholic.name,
      visualDescription: validated.data.nonAlcoholic.visualDescription
    })
  ]);

  return NextResponse.json({
    ...validated.data,
    alcoholic: { ...validated.data.alcoholic, image: alcImage },
    nonAlcoholic: { ...validated.data.nonAlcoholic, image: naImage }
  });
}
