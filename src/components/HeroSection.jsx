import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const GRADIENT =
  "radial-gradient(20% 14% at 50% 62%, rgba(253,253,199,0.9) 0%, rgba(233,246,176,0.32) 55%, rgba(233,246,176,0) 100%), linear-gradient(180deg,#ECF7B2 0%,#EDF7B8 10%,#EEF7BE 20%,#EFF7C6 30%,#F0F7CD 40%,#EFF6D4 50%,#EEF4D2 55%,#E6EDCC 60%,#DBE2C1 65%,#C8D3B5 70%,#AFBCA2 75%,#92A18A 80%,#6D826F 85%,#435E4F 90%,#15342C 95%,#0C2D26 100%)";

export default function HeroSection({ units = [], totalWords = 0 }) {
  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[#0B2D25]"
      aria-label="Vocabulary practice"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: GRADIENT }}>
        <div className="hs-rings" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[86vh] w-full max-w-6xl flex-col justify-between gap-14 px-6 pb-10 pt-16 sm:px-8 lg:pt-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="hs-rise rounded-full border border-[#17352B]/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#17352B]/80">
            {totalWords} words · {units.length} units
          </span>

          <h1 className="hs-rise max-w-4xl font-display text-[clamp(2.5rem,7vw,4.6rem)] leading-[1.03] tracking-tight text-[#17352B] [animation-delay:60ms]">
            Learn every word,
            <br className="hidden sm:inline" /> one question at a time
          </h1>

          <p className="hs-rise max-w-xl text-[15px] leading-relaxed text-[#26473C] [animation-delay:120ms] sm:text-base">
            Antonyms, synonyms, definitions, spelling and mixed review.
            Every word in your list gets its own question, and a wrong answer
            waits for you to try again.
          </p>

          <div className="hs-rise mt-2 flex flex-wrap items-center justify-center gap-3 [animation-delay:180ms]">
            <Link
              to="/practice/$mode"
              params={{ mode: "mixed" }}
              search={{}}
              className="inline-flex min-h-[46px] min-w-[190px] items-center justify-center gap-2 rounded-full border border-[#17352B] bg-[#17352B] px-7 text-sm font-medium text-[#F1F7DA] transition-colors hover:bg-transparent hover:text-[#17352B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17352B]"
            >
              Start a mixed round
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#modes"
              className="inline-flex min-h-[46px] min-w-[190px] items-center justify-center rounded-full border border-[#17352B] px-7 text-sm font-medium text-[#17352B] transition-colors hover:bg-[#17352B] hover:text-[#F1F7DA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17352B]"
            >
              Choose a mode
            </a>
          </div>
        </div>

        <div className="hs-rise [animation-delay:280ms]">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F1F7DA]/50">
            Jump into a unit
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-[#F1F7DA]">
            {units.map((unit) => (
              <Link
                key={unit.name}
                to="/practice/$mode"
                params={{ mode: "mixed" }}
                search={{ unit: unit.name }}
                className="group flex flex-col transition-opacity hover:opacity-100 opacity-90"
              >
                <span className="font-display text-2xl leading-none">{unit.name}</span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F1F7DA]/50 group-hover:text-[#E8F4B8]">
                  {unit.count} words
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}