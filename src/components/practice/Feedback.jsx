import { CheckCircle2, XCircle } from "lucide-react";

export default function Feedback({ status, answer }) {
  if (status === "idle") return <div className="h-6" />;

  if (status === "correct") {
    return (
      <p className="flex h-6 items-center gap-2 text-sm font-medium text-primary">
        <CheckCircle2 className="h-4 w-4" />
        Correct — {answer}
      </p>
    );
  }

  return (
    <p className="flex h-6 items-center gap-2 text-sm font-medium text-destructive">
      <XCircle className="h-4 w-4" />
      Not quite — try again.
    </p>
  );
}