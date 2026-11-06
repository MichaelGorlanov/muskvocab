import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MODES } from "@/lib/modes";

export default function ModeGrid({ counts = {}, unit }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const count = counts[mode.key] || 0;
        const body = (
          <>
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/70 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {count} {count === 1 ? "question" : "questions"}
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl leading-tight text-foreground">{mode.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{mode.blurb}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-primary">
              {count ? "Start" : "Add words first"}
              {count ? (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              ) : null}
            </span>
          </>
        );

        const shell =
          "group flex h-full flex-col gap-5 rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300";

        if (!count) {
          return (
            <div key={mode.key} className={`${shell} opacity-60`}>
              {body}
            </div>
          );
        }

        return (
          <Link
            key={mode.key}
            to="/practice/$mode"
            params={{ mode: mode.key }}
            search={unit ? { unit } : {}}
            className={`${shell} hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_20px_44px_-28px_rgba(14,42,34,0.55)]`}
          >
            {body}
          </Link>
        );
      })}
    </div>
  );
}