import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TypeQuestion({ question, status, onPick }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setValue("");
    inputRef.current?.focus();
  }, [question]);

  const correct = status === "correct";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim() || correct) return;
        onPick(value);
      }}
      className="grid gap-4"
    >
      <p className="font-mono text-sm tracking-[0.3em] text-muted-foreground">{question.hint}</p>

      <div className="relative">
        <input
          ref={inputRef}
          value={correct ? question.answer : value}
          onChange={(event) => setValue(event.target.value)}
          disabled={correct}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Type the word…"
          className={cn(
            "w-full rounded-xl border bg-card px-5 py-4 font-mono text-[17px] tracking-wide text-foreground outline-none transition-colors placeholder:text-muted-foreground/60",
            "border-border focus:border-primary",
            status === "wrong" && "border-destructive/60",
            correct && "border-primary bg-accent/50"
          )}
        />
        {status === "wrong" ? (
          <X className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
        ) : null}
        {correct ? (
          <Check className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
        ) : null}
      </div>

      <button
        type="submit"
        disabled={correct || !value.trim()}
        className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Check spelling
      </button>
    </form>
  );
}