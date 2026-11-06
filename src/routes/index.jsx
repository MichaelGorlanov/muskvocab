import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import ModeGrid from "@/components/ModeGrid";
import { countQuestion, unitsOf } from "@/lib/questions";
import { MODES } from "@/lib/modes";
import { listWords } from "@/lib/server-fns";

export const Route = createFileRoute("/")({
  loader: async () => ({ words: await listWords() }),
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Vocab Lab — practice your words" },
      {
        name: "description",
        content:
          "Practice antonyms, synonyms, definitions, spelling, roots and mixed review — one question at a time.",
      },
    ],
  }),
});

function HomePage() {
  const { words } = Route.useLoaderData();
  const [unit, setUnit] = useState(null);

  const units = useMemo(
    () =>
      unitsOf(words).map((name) => ({
        name,
        count: words.filter((w) => w.unit === name).length,
      })),
    [words]
  );

  const scoped = useMemo(
    () => (unit ? words.filter((w) => w.unit === unit) : words),
    [words, unit]
  );

  const counts = useMemo(
    () => Object.fromEntries(MODES.map((m) => [m.key, countQuestion(scoped, m.key)])),
    [scoped]
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection units={units} totalWords={words.length} />

      <main id="modes" className="mx-auto w-full max-w-6xl scroll-mt-14 px-6 py-16 sm:px-8 lg:py-24">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Pick your drill
            </p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,4vw,2.9rem)] leading-[1.08] tracking-tight text-foreground">
              Six ways to lock the words in
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Each mode asks one question per word in the list, so nothing gets skipped.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setUnit(null)}
            className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              unit === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            All units
          </button>
          {units.map((u) => (
            <button
              key={u.name}
              type="button"
              onClick={() => setUnit(u.name)}
              className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                unit === u.name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>

        {words.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h3 className="font-display text-2xl">Your word bank is empty</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Paste your vocabulary list and every mode below fills up with questions.
            </p>
            <Link
              to="/words"
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Add my words
            </Link>
          </div>
        ) : (
          <ModeGrid counts={counts} unit={unit} />
        )}
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-display text-base text-foreground">Vocab Lab</span>
          <span>Built for one thing: getting every word right.</span>
        </div>
      </footer>
    </div>
  );
}