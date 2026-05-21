import type { Cocktail } from '@/lib/schema';

type Accent = 'rose' | 'sage';

const ACCENT_CLASSES: Record<Accent, { text: string; pill: string; shadow: string; imageTint: string }> = {
  rose: {
    text: 'text-rose',
    pill: 'bg-rose-pastel text-rose',
    shadow: 'shadow-[0_18px_40px_-20px_rgba(198,100,139,0.40)]',
    imageTint: 'bg-rose-pastel'
  },
  sage: {
    text: 'text-sage',
    pill: 'bg-sage-pastel text-sage',
    shadow: 'shadow-[0_18px_40px_-20px_rgba(123,160,132,0.38)]',
    imageTint: 'bg-sage-pastel'
  }
};

export function CocktailCard({
  cocktail,
  kicker,
  accent
}: {
  cocktail: Cocktail;
  kicker: string;
  accent: Accent;
}) {
  const a = ACCENT_CLASSES[accent];

  return (
    <article
      className={`rounded-2xl border border-cream-border bg-cream-card overflow-hidden ${a.shadow}`}
    >
      <div className={`relative aspect-square overflow-hidden ${a.imageTint}`}>
        {cocktail.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cocktail.image}
            alt={cocktail.visualDescription}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent mix-blend-multiply"
        />
      </div>

      <div className="p-7 sm:p-8">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.28em] ${a.pill}`}
        >
          {kicker}
        </span>
        <h2 className="mt-4 font-serif text-3xl leading-[1.1] tracking-tightest text-ink">
          {cocktail.name}
        </h2>
        <p className="mt-4 font-serif italic text-lg leading-[1.55] text-ink/85">
          {cocktail.rationale}
        </p>

        <div className="mt-7">
          <h3 className="font-sans text-[10px] uppercase tracking-[0.28em] text-ink-muted">
            Ingredients
          </h3>
          <ul className="mt-3 divide-y divide-cream-border/60">
            {cocktail.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex justify-between gap-4 py-2 font-sans text-sm leading-[1.6]"
              >
                <span className="text-ink">{ing.item}</span>
                <span className="text-ink-muted tabular-nums whitespace-nowrap">
                  {ing.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-sans text-[10px] uppercase tracking-[0.28em] text-ink-muted">
            Method
          </h3>
          <ol className="mt-3 space-y-3">
            {cocktail.instructions.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 font-sans text-sm leading-[1.6] text-ink"
              >
                <span
                  className={`font-serif text-base tabular-nums leading-[1.4] min-w-[1ch] ${a.text}`}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {cocktail.garnish && (
          <p className="mt-7 pt-5 border-t border-cream-border/60 font-sans text-sm text-ink-muted">
            <span className="text-[10px] uppercase tracking-[0.28em] mr-2">
              Garnish
            </span>
            <span className="text-ink">{cocktail.garnish}</span>
          </p>
        )}
      </div>
    </article>
  );
}
