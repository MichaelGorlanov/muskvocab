import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChoiceQuestion({ question, status, wrongPicks, onPick }) {
  return (
    <div className="grid gap-3">
      {question.options.map((option) => {
        const isWrong = wrongPicks.includes(option);
        const isRight = status === "correct" && option === question.answer;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            disabled={isWrong || status === "correct"}
            className={cn(
              "group flex w-full items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4 text-left text-[15px] leading-snug transition-all duration-200",
              "border-border hover:border-primary/40 hover:bg-secondary/40",
              isWrong && "border-destructive/40 bg-destructive/5 text-muted-foreground line-through",
              isRight && "border-primary bg-accent/60 text-foreground",
              status === "correct" && !isRight && "opacity-50"
            )}
          >
            <span className="pr-2">{option}</span>
            {isWrong ? <X className="h-4 w-4 shrink-0 text-destructive" /> : null}
            {isRight ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
          </button>
        );
      })}
    </div>
  );
}