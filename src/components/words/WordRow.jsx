import { Pencil, Trash2 } from "lucide-react";

export default function WordRow({ word, onEdit, onDelete }) {
  return (
    <li className="flex flex-col gap-2 border-b border-border/60 py-3.5 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-lg text-foreground">{word.term}</span>
          {word.partOfSpeech ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {word.partOfSpeech}
            </span>
          ) : null}
          {word.root ? (
            <span className="rounded-full bg-accent/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
              {word.root}
              {word.rootMeaning ? ` · ${word.rootMeaning}` : ""}
            </span>
          ) : null}
        </div>
        {word.definition ? (
          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{word.definition}</p>
        ) : null}
        {word.synonyms?.length || word.antonyms?.length ? (
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
            {word.synonyms?.length ? <span>+ {word.synonyms.join(", ")}</span> : null}
            {word.synonyms?.length && word.antonyms?.length ? <span className="px-2">·</span> : null}
            {word.antonyms?.length ? <span>− {word.antonyms.join(", ")}</span> : null}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(word)}
          aria-label={`Edit ${word.term}`}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(word)}
          aria-label={`Delete ${word.term}`}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}