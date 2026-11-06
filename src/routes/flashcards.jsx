import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, RotateCw, Shuffle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import UnitPicker from "@/components/UnitPicker";
import FlashcardCard from "@/components/flashcards/FlashcardCard";
import { listWords } from "@/lib/server-fns";
import { scopeWords, unitsOf } from "@/lib/questions";

export const Route = createFileRoute("/flashcards")({
  validateSearch: (search) => ({
    unit: typeof search.unit === "string" ? search.unit : undefined,
  }),
  loader: async () => ({ words: await listWords() }),
  component: FlashcardsPage,
  head: () => ({
    meta: [{ title: "Flashcards — Vocab Lab" }],
  }),
});

const parseUnits = (param) =>
  String(param || "")
    .split("|")
    .map((name) => name.trim())
    .filter(Boolean);

function FlashcardsPage() {
  const { unit } = Route.useSearch();
  const { words } = Route.useLoaderData();

  const [selected, setSelected] = useState(() => parseUnits(unit));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("vocablab-card-name");
    if (saved) setName(saved);
  }, []);

  const updateName = (value) => {
    setName(value);
    window.localStorage.setItem("vocablab-card-name", value);
  };

  const units = useMemo(
    () =>
      unitsOf(words).map((unitName) => ({
        name: unitName,
        count: words.filter((w) => w.unit === unitName).length,
      })),
    [words]
  );

  const deck = useMemo(() => {
    const list = scopeWords(words, selected.join("|"));
    if (!shuffleKey) return list;
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [words, selected, shuffleKey]);

  const total = deck.length;
  const safeIndex = total ? Math.min(index, total - 1) : 0;
  const card = total ? deck[safeIndex] : null;

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [selected, shuffleKey]);

  const go = (step) => {
    if (!total) return;
    setFlipped(false);
    setIndex((prev) => (prev + step + total) % total);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {total} {total === 1 ? "card" : "cards"}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight tracking-tight">
              Flashcards
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Choose your lessons, then flip each card until the meaning sticks.
            </p>
          </div>

          <label className="grid gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Name on the card
            </span>
            <input
              value={name}
              onChange={(event) => updateName(event.target.value)}
              placeholder="Your name"
              className="h-10 w-48 rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>

        <div className="mt-7">
          <UnitPicker units={units} selected={selected} onChange={setSelected} />
        </div>

        {card ? (
          <>
            <div className="mt-8">
              <FlashcardCard
                key={card.id}
                word={card}
                flipped={flipped}
                onFlip={() => setFlipped((prev) => !prev)}
                name={name || "your name"}
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFlipped((prev) => !prev)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <RotateCw className="h-4 w-4" />
                  Flip
                </button>
                <button
                  type="button"
                  onClick={() => setShuffleKey((prev) => prev + 1)}
                  aria-label="Shuffle the deck"
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <Shuffle className="h-4 w-4" />
                  Shuffle
                </button>
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Card {safeIndex + 1} of {total}
            </p>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="font-display text-2xl">No cards in this selection</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Add words to your word bank, or choose a lesson that has some.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}