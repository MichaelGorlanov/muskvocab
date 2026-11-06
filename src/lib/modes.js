import {
  ArrowLeftRight,
  BookOpen,
  Equal,
  Keyboard,
  Shuffle,
  Sprout,
} from "lucide-react";

export const MODES = [
  {
    key: "antonyms",
    label: "Antonyms",
    blurb: "Pick the word that means the opposite.",
    icon: ArrowLeftRight,
  },
  {
    key: "synonyms",
    label: "Synonyms",
    blurb: "Pick the word that means the same thing.",
    icon: Equal,
  },
  {
    key: "definitions",
    label: "Definitions",
    blurb: "Match each word to its meaning.",
    icon: BookOpen,
  },
  {
    key: "spelling",
    label: "Spelling",
    blurb: "Read the meaning, then type the word.",
    icon: Keyboard,
  },
  {
    key: "mixed",
    label: "Mixed",
    blurb: "Every word, every question type.",
    icon: Shuffle,
  },
  {
    key: "roots",
    label: "Roots",
    blurb: "Link each root to a word built on it.",
    icon: Sprout,
  },
];

export const MODE_KEYS = MODES.map((m) => m.key);

export function getMode(key) {
  return MODES.find((m) => m.key === key);
}