import { Link } from "@tanstack/react-router";

export default function QuizHeader({ modeLabel, unit, index, total }) {
  const progress = total ? ((index + 1) / total) * 100 : 0;
  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Exit
          </Link>
          <span className="h-3 w-px bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            {modeLabel}
          </span>
          {unit ? (
            <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-secondary-foreground">
              {unit}
            </span>
          ) : null}
        </div>
        <span className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}