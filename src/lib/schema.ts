import { z } from 'zod';

export const IngredientSchema = z.object({
  item: z.string().min(1),
  amount: z.string().min(1)
});

export const CocktailSchema = z.object({
  name: z.string().min(1),
  rationale: z.string().min(1).max(240),
  ingredients: z.array(IngredientSchema).min(2).max(10),
  instructions: z.array(z.string().min(1)).min(2).max(8),
  garnish: z.string(),
  visualDescription: z.string().min(1),
  image: z.string().url().optional()
});

export const PairingSchema = z.object({
  kind: z.literal('pairing'),
  dish: z.string().min(1),
  alcoholic: CocktailSchema,
  nonAlcoholic: CocktailSchema
});

export const OffTopicSchema = z.object({
  kind: z.literal('off_topic'),
  message: z.string().min(1)
});

export const PairingResponseSchema = z.discriminatedUnion('kind', [
  PairingSchema,
  OffTopicSchema
]);

export type Ingredient = z.infer<typeof IngredientSchema>;
export type Cocktail = z.infer<typeof CocktailSchema>;
export type Pairing = z.infer<typeof PairingSchema>;
export type OffTopic = z.infer<typeof OffTopicSchema>;
export type PairingResponse = z.infer<typeof PairingResponseSchema>;
