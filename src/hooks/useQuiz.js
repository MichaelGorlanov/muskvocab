import { useCallback, useEffect, useState } from "react";
import { answerMatches } from "@/lib/questions";

export function useQuiz(questions) {
  const total = questions?.length || 0;
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState("idle");
  const [wrongPicks, setWrongPicks] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIndex(0);
    setAttempts(0);
    setStatus("idle");
    setWrongPicks([]);
    setFirstTry(0);
    setMissed([]);
    setDone(false);
  }, [questions]);

  const question = total ? questions[index] : null;

  const submit = useCallback(
    (value) => {
      if (!question || status === "correct") return false;
      const correct = answerMatches(question, value);
      if (correct) {
        if (attempts === 0) setFirstTry((n) => n + 1);
        setStatus("correct");
      } else {
        setAttempts((n) => n + 1);
        setWrongPicks((p) => (p.includes(value) ? p : [...p, value]));
        setStatus("wrong");
      }
      return correct;
    },
    [question, status, attempts]
  );

  useEffect(() => {
    if (status !== "correct" || !question) return undefined;
    const timer = setTimeout(() => {
      if (attempts > 0) setMissed((prev) => [...prev, question]);
      if (index + 1 >= total) {
        setDone(true);
        return;
      }
      setIndex((i) => i + 1);
      setAttempts(0);
      setWrongPicks([]);
      setStatus("idle");
    }, 900);
    return () => clearTimeout(timer);
  }, [status, index, total, attempts, question]);

  return {
    index,
    total,
    question,
    status,
    attempts,
    wrongPicks,
    firstTry,
    missed,
    done,
    submit,
    restart: () => {
      setIndex(0);
      setAttempts(0);
      setStatus("idle");
      setWrongPicks([]);
      setFirstTry(0);
      setMissed([]);
      setDone(false);
    },
  };
}