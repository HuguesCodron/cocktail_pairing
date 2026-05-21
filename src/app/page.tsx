import { PairingForm } from '@/components/pairing-form';

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <header className="mb-12 sm:mb-16">
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-rose mb-6">
          Pour &amp; Plate
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tightest text-ink">
          Pair your dinner
          <br />
          <span className="italic text-lavender">with the right glass.</span>
        </h1>
        <p className="mt-7 max-w-xl font-sans text-lg leading-[1.7] text-ink-muted">
          Tell us what you&apos;re cooking. We&apos;ll pour you one cocktail and one
          alcohol-free alternative — chosen for the way they actually taste against
          the food.
        </p>
      </header>

      <PairingForm />
    </main>
  );
}
