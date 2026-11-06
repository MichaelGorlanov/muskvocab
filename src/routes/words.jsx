import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import WordRow from "@/components/words/WordRow";
import { listWords } from "@/lib/server-fns";

export const Route = createFileRoute("/words")({
  loader: async () => ({ words: await listWords() }),
  component: WordBankPage,
  head: () => ({
    meta: [{ title: "Word bank — Vocab Lab" }],
  }),
});

function WordBankPage() {
  const { words } = Route.useLoaderData();

  const grouped = useMemo(() => {
    const map = new Map();
    words.forEach((word) => {
      const key = word.unit || "Unsorted";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(word);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([unit, list]) => ({
        unit,
        list: [...list].sort((a, b) => (a.term || "").localeCompare(b.term || "", "en")),
      }));
  }, [words]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {words.length} words · {grouped.length} units
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight tracking-tight">
            The word bank
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Every word in the course, by lesson. Each one becomes a question in every practice mode.
          </p>
        </div>

        {words.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="font-display text-2xl">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              The word lists haven't been added yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8">
            {grouped.map(({ unit, list }) => (
              <section key={unit} className="rounded-2xl border border-border/80 bg-card px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <h2 className="font-display text-xl">
                    {unit}
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {list.length} words
                    </span>
                  </h2>
                  <Link
                    to="/practice/$mode"
                    params={{ mode: "mixed" }}
                    search={{ unit }}
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:underline"
                  >
                    Practice this unit
                  </Link>
                </div>

                <ul className="mt-1">
                  {list.map((word) => (
                    <WordRow key={word.id} word={word} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}