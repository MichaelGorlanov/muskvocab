const CHIP =
  "rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors";
const ON = "border-primary bg-primary text-primary-foreground";
const OFF = "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground";

export default function UnitPicker({ units = [], selected = [], onChange, allLabel = "All lessons" }) {
  const isAll = selected.length === 0;

  const toggle = (name) => {
    onChange(
      selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name]
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange([])}
        aria-pressed={isAll}
        className={`${CHIP} ${isAll ? ON : OFF}`}
      >
        {allLabel}
      </button>
      {units.map((unit) => {
        const on = selected.includes(unit.name);
        return (
          <button
            key={unit.name}
            type="button"
            onClick={() => toggle(unit.name)}
            aria-pressed={on}
            className={`${CHIP} ${on ? ON : OFF}`}
          >
            {unit.name}
            {typeof unit.count === "number" ? (
              <span className="ml-1.5 opacity-55">{unit.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}