export default function FlashcardCard({ word, flipped, onFlip, name }) {
  const synonyms = (word.synonyms || []).join(", ");
  const antonyms = (word.antonyms || []).join(", ");

  const face =
    "absolute inset-0 flex flex-col rounded-3xl border border-border bg-card px-6 py-5 sm:px-8 sm:py-6 [backface-visibility:hidden]";
  const shadow = "shadow-[0_28px_70px_-46px_rgba(14,42,34,0.6)]";

  return (
    <div className="[perspective:1800px]">
      <div
        role="button"
        tabIndex={0}
        onClick={onFlip}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onFlip();
          }
        }}
        className="relative h-[400px] w-full cursor-pointer outline-none transition-transform duration-500 [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-ring sm:h-[480px]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        aria-label={flipped ? `${word.term} — flip back` : `${word.term} — flip for the meaning`}
      >
        <div className={`${face} ${shadow}`}>
          <div className="flex justify-end font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
            {name}
          </div>
          <div className="flex flex-1 items-center justify-center px-2">
            <span className="text-center font-display text-[clamp(2.4rem,9vw,5rem)] leading-[1.05] tracking-tight text-foreground">
              {word.term}
            </span>
          </div>
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Tap to flip
          </p>
        </div>

        <div className={`${face} ${shadow} overflow-y-auto [transform:rotateY(180deg)]`}>
          <div className="flex justify-end font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
            {name}
          </div>

          <div className="mt-2">
            <p className="font-display text-[clamp(1.7rem,5vw,2.4rem)] leading-tight text-foreground">
              {word.term}
            </p>
            {word.partOfSpeech ? (
              <p className="mt-0.5 text-sm italic text-muted-foreground">{word.partOfSpeech}</p>
            ) : null}
          </div>

          {word.definition ? (
            <p className="mt-4 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
              {word.definition}
            </p>
          ) : null}

          <div className="mt-auto grid gap-3 pt-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Synonyms
              </p>
              <p className="min-h-[26px] border-b border-dashed border-border pb-1 text-sm leading-snug text-foreground">
                {synonyms}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Antonyms
              </p>
              <p className="min-h-[26px] border-b border-dashed border-border pb-1 text-sm leading-snug text-foreground">
                {antonyms}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}