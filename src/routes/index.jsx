import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import ModeGrid from "@/components/ModeGrid";
import UnitPicker from "@/components/UnitPicker";
import { countQuestion, scopeWords, unitsOf, unitsParam } from "@/lib/questions";
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
  const [selected, setSelected] = useState([]);

  const units = useMemo(
    () =>
      unitsOf(words).map((name) => ({
        name,
        count: words.filter((w) => w.unit === name).length,
      })),
    [words]
  );

  const unit = unitsParam(selected);

  const scoped = useMemo(() => scopeWords(words, unit), [words, unit]);

  const counts = useMemo(
    () => Object.fromEntries(MODES.map((m) => [m.key, countQuestion(scoped, m.key)])),
    [scoped]
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection units={units} totalWords={words.length} />

      <main id="modes" className="mx-auto w-full max-w-6xl scroll-mt-14 px-6 py-16 sm:px-8 lg:py-24">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Step 1 — choose your words
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.35rem)] leading-tight tracking-tight text-foreground">
            Which lessons are you studying?
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Pick as many as you like — the set below follows your choice.
          </p>
          <div className="mt-5">
            <UnitPicker units={units} selected={selected} onChange={setSelected} />
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-6 border-t border-border/70 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Step 2 — pick your drill
            </p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,4vw,2.9rem)] leading-[1.08] tracking-tight text-foreground">
              Six ways to lock the words in
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Each mode asks one question per word in your selection, so nothing gets skipped.
          </p>
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

        <Link
          to="/flashcards"
          search={unit ? { unit } : {}}
          className="group mt-6 flex flex-col gap-4 rounded-2xl border border-border/80 bg-accent/25 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-primary">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl leading-tight text-foreground">
                Flashcards
              </h3>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                Flip through the same selection at your own pace — word on the front, meaning,
                synonyms and antonyms on the back.
              </p>
            </div>
          </div>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
            Open deck →
          </span>
        </Link>
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