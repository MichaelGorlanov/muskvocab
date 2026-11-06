import { Link } from "@tanstack/react-router";
import { RotateCcw, Trophy } from "lucide-react";

export default function ResultsPanel({ modeLabel, total, firstTry, missed, onRetry, unit }) {
  const percent = total ? Math.round((firstTry / total) * 100) : 0;
  const headline = percent === 100 ? "Perfect round." : percent >= 70 ? "Nicely done." : "Keep going.";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-[0_24px_60px_-40px_rgba(14,42,34,0.6)] sm:p-12">
        <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-accent/70 text-primary">
          <Trophy className="h-6 w-6" />
        </span>

        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {modeLabel}
          {unit ? ` · ${unit}` : ""}
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground">
          {headline}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-mono text-base text-foreground tabular-nums">{firstTry}</span> of{" "}
          <span className="font-mono text-base text-foreground tabular-nums">{total}</span> right on
          the first try ({percent}%).
        </p>

        {missed.length ? (
          <div className="mt-8 rounded-xl border border-border/80 bg-secondary/40 p-5 text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Worth another look
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {missed.map((q, i) => (
                <li
                  key={`${q.word}-${i}`}
                  className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-foreground"
                >
                  {q.word}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No misses. Nothing left to review.</p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Practice again
          </button>
          <Link
            to="/"
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-border px-7 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
          >
            Back to modes
          </Link>
        </div>
      </div>
    </div>
  );
}