export function CocktailCardSkeleton() {
  return (
    <div className="rounded-2xl border border-cream-border bg-cream-card overflow-hidden shadow-[0_14px_36px_-18px_rgba(45,36,56,0.18)]">
      <div className="aspect-square bg-ink/[0.05] animate-pulse" />
      <div className="p-7 sm:p-8 space-y-4">
        <div className="h-2.5 w-20 rounded-full bg-ink/[0.08] animate-pulse" />
        <div className="h-7 w-2/3 rounded-md bg-ink/[0.08] animate-pulse" />
        <div className="space-y-2 pt-1">
          <div className="h-4 w-full rounded-md bg-ink/[0.06] animate-pulse" />
          <div className="h-4 w-5/6 rounded-md bg-ink/[0.06] animate-pulse" />
        </div>
        <div className="space-y-2 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-full rounded-md bg-ink/[0.05] animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
