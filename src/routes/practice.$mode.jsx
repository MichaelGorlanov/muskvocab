import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import QuizHeader from "@/components/practice/QuizHeader";
import ChoiceQuestion from "@/components/practice/ChoiceQuestion";
import TypeQuestion from "@/components/practice/TypeQuestion";
import Feedback from "@/components/practice/Feedback";
import ResultsPanel from "@/components/practice/ResultsPanel";
import { useQuiz } from "@/hooks/useQuiz";
import { buildQuestions } from "@/lib/questions";
import { getMode } from "@/lib/modes";
import { listWords } from "@/lib/server-fns";

export const Route = createFileRoute("/practice/$mode")({
  loader: async () => ({ words: await listWords() }),
  validateSearch: (search) => ({
    unit: typeof search.unit === "string" ? search.unit : undefined,
  }),
  component: PracticePage,
  head: () => ({
    meta: [{ title: "Practice — Vocab Lab" }],
  }),
});

function PracticePage() {
  const { mode } = Route.useParams();
  const { unit } = Route.useSearch();
  const modeMeta = getMode(mode) || getMode("mixed");

  const { words: allWords } = Route.useLoaderData();

  const words = useMemo(
    () => (unit ? allWords.filter((w) => w.unit === unit) : allWords),
    [allWords, unit]
  );

  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    setQuestions(buildQuestions(words, modeMeta.key));
  }, [words, modeMeta.key]);

  const quiz = useQuiz(questions);

  const retry = () => setQuestions(buildQuestions(words, modeMeta.key));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
        {questions === null ? (
          <div className="mx-auto h-72 w-full max-w-2xl animate-pulse rounded-2xl bg-secondary/60" />
        ) : questions.length === 0 ? (
          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border/80 bg-card p-10 text-center">
            <h2 className="font-display text-2xl">Nothing to ask yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              There are no words with the right details for this mode{unit ? ` in ${unit}` : ""}.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Back to modes
            </Link>
          </div>
        ) : quiz.done ? (
          <ResultsPanel
            modeLabel={modeMeta.label}
            unit={unit}
            total={quiz.total}
            firstTry={quiz.firstTry}
            missed={quiz.missed}
            onRetry={retry}
          />
        ) : (
          <>
            <QuizHeader
              modeLabel={modeMeta.label}
              unit={unit}
              index={quiz.index}
              total={quiz.total}
            />

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[0_24px_60px_-46px_rgba(14,42,34,0.55)] sm:p-9">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {quiz.question.tag}
              </p>
              <h2
                className={
                  quiz.question.kind === "type"
                    ? "mt-3 text-lg leading-relaxed text-foreground sm:text-xl"
                    : "mt-3 font-display text-[clamp(1.9rem,4.4vw,2.7rem)] leading-[1.1] tracking-tight text-foreground"
                }
              >
                {quiz.question.prompt}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{quiz.question.sub}</p>

              <div className="mt-7">
                {quiz.question.kind === "type" ? (
                  <TypeQuestion
                    question={quiz.question}
                    status={quiz.status}
                    onPick={quiz.submit}
                  />
                ) : (
                  <ChoiceQuestion
                    question={quiz.question}
                    status={quiz.status}
                    wrongPicks={quiz.wrongPicks}
                    onPick={quiz.submit}
                  />
                )}
              </div>

              <div className="mt-4">
                <Feedback status={quiz.status} answer={quiz.question.answer} />
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {quiz.attempts > 0 && quiz.status === "wrong"
                ? "Stay on this one — the next question comes once you get it right."
                : "Wrong answers don't move you on."}
            </p>
          </>
        )}
      </main>
    </div>
  );
}