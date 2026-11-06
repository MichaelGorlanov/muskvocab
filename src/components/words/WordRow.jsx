export default function WordRow({ word }) {
  return (
    <li className="border-b border-border/60 py-3.5 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-display text-lg text-foreground">{word.term}</span>
        {word.partOfSpeech ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {word.partOfSpeech}
          </span>
        ) : null}
      </div>
      {word.definition ? (
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{word.definition}</p>
      ) : null}
      {word.synonyms?.length || word.antonyms?.length ? (
        <div className="mt-1 grid gap-0.5 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
          {word.synonyms?.length ? (
            <span>
              <span className="text-muted-foreground">synonym:</span> {word.synonyms.join(", ")}
            </span>
          ) : null}
          {word.antonyms?.length ? (
            <span>
              <span className="text-muted-foreground">antonym:</span> {word.antonyms.join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}