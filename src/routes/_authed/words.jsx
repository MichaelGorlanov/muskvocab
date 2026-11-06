import { useMemo, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Upload } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import WordRow from "@/components/words/WordRow";
import WordFormDialog from "@/components/words/WordFormDialog";
import ImportPanel from "@/components/words/ImportPanel";
import { listWords, deleteWord, deleteUnit } from "@/lib/server-fns";
import { unitsOf } from "@/lib/questions";

export const Route = createFileRoute("/_authed/words")({
  ssr: false,
  loader: async () => ({ words: await listWords() }),
  component: WordBankPage,
  head: () => ({
    meta: [{ title: "Word bank — Vocab Lab" }],
  }),
});

function WordBankPage() {
  const { words } = Route.useLoaderData();
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const units = useMemo(() => unitsOf(words), [words]);

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

  const remove = useMutation({
    mutationFn: (id) => deleteWord({ data: { id } }),
    onSuccess: () => router.invalidate(),
  });

  const clearUnit = useMutation({
    mutationFn: (unit) => deleteUnit({ data: { unit } }),
    onSuccess: () => router.invalidate(),
  });

  const refresh = () => router.invalidate();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {words.length} words · {grouped.length} units
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight tracking-tight">
              Your word bank
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Paste a whole list at once, or add words one by one. Every word you add becomes a
              question in each mode.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setImportOpen(true);
              }}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Upload className="h-4 w-4" />
              Paste a list
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add a word
            </button>
          </div>
        </div>

        {words.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="font-display text-2xl">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Paste your vocabulary list to get every practice mode working.
            </p>
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Paste my list
            </button>
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
                  <div className="flex items-center gap-2">
                    <Link
                      to="/practice/$mode"
                      params={{ mode: "mixed" }}
                      search={{ unit }}
                      className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:underline"
                    >
                      Practice this unit
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (clearUnit.isPending) return;
                        if (window.confirm(`Delete all ${list.length} words in ${unit}?`)) {
                          clearUnit.mutate(unit);
                        }
                      }}
                      aria-label={`Delete ${unit}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <ul className="mt-1">
                  {list.map((word) => (
                    <WordRow
                      key={word.id}
                      word={word}
                      onEdit={(w) => {
                        setEditing(w);
                        setFormOpen(true);
                      }}
                      onDelete={(w) => remove.mutate(w.id)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      <WordFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        defaultUnit={grouped[0]?.unit || "Unit 1"}
        units={units}
        onSaved={refresh}
      />

      <ImportPanel
        open={importOpen}
        onOpenChange={setImportOpen}
        defaultUnit={grouped[grouped.length - 1]?.unit || "Unit 1"}
        units={units}
        onSaved={refresh}
      />
    </div>
  );
}