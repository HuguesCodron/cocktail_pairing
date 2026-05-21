'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CocktailCard } from '@/components/cocktail-card';
import { CocktailCardSkeleton } from '@/components/cocktail-card-skeleton';
import type { PairingResponse } from '@/lib/schema';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PairingResponse }
  | { status: 'error'; message: string };

export function PairingForm() {
  const [dish, setDish] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = dish.trim();
    if (!trimmed || state.status === 'loading') return;

    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/pair', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dish: trimmed })
      });
      const json = await res.json();
      if (!res.ok) {
        setState({
          status: 'error',
          message: typeof json?.error === 'string' ? json.error : 'Something went wrong.'
        });
        return;
      }
      setState({ status: 'success', data: json as PairingResponse });
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' });
    }
  }

  const isLoading = state.status === 'loading';

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <Input
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="What are you cooking tonight?"
          aria-label="What are you cooking tonight?"
          className="flex-1 h-14 px-6 text-lg"
          disabled={isLoading}
          autoFocus
        />
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !dish.trim()}
          className="sm:w-auto"
        >
          {isLoading ? 'Pouring…' : 'Pair it'}
        </Button>
      </form>

      <div className="mt-12 sm:mt-14">
        {state.status === 'loading' && (
          <div className="grid gap-6 md:grid-cols-2">
            <CocktailCardSkeleton />
            <CocktailCardSkeleton />
          </div>
        )}

        {state.status === 'error' && (
          <div className="rounded-2xl border border-cream-border bg-cream-card px-6 py-5 shadow-[0_10px_30px_-15px_rgba(45,36,56,0.18)]">
            <p className="font-serif text-2xl tracking-tightest text-ink">
              Something went wrong.
            </p>
            <p className="mt-2 font-sans text-sm leading-[1.7] text-ink-muted">
              {state.message}
            </p>
          </div>
        )}

        {state.status === 'success' && state.data.kind === 'off_topic' && (
          <div className="rounded-2xl border border-cream-border bg-cream-card px-7 py-6 shadow-[0_10px_30px_-15px_rgba(138,91,168,0.22)]">
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-lavender">
              Off the menu
            </p>
            <p className="mt-3 font-serif text-2xl tracking-tightest text-ink leading-tight">
              We only pair cocktails with food.
            </p>
            <p className="mt-3 font-sans text-base leading-[1.7] text-ink-muted">
              {state.data.message}
            </p>
          </div>
        )}

        {state.status === 'success' && state.data.kind === 'pairing' && (
          <>
            <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.28em] text-ink-muted">
              For your <span className="text-ink">{state.data.dish}</span>
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <CocktailCard
                cocktail={state.data.alcoholic}
                kicker="Alcoholic"
                accent="rose"
              />
              <CocktailCard
                cocktail={state.data.nonAlcoholic}
                kicker="Alcohol-free"
                accent="sage"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
