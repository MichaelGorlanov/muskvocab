// Pure question-building helpers. Every mode creates exactly one question per
// item it covers, so the number of problems always matches the word bank size.

const clean = (value) => String(value ?? "").trim();

export function listOf(value) {
  if (Array.isArray(value)) return Array.from(new Set(value.map(clean).filter(Boolean)));
  return Array.from(
    new Set(
      clean(value)
        .split(/[,;]/)
        .map(clean)
        .filter(Boolean)
    )
  );
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function takeDistinct(pool, count, banned) {
  const blocked = banned || new Set();
  return shuffle(
    Array.from(new Set(pool.map(clean).filter((v) => v && !blocked.has(v))))
  ).slice(0, count);
}

export function normalizeAnswer(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export function answerMatches(question, value) {
  if (!question) return false;
  if (question.kind === "type") return normalizeAnswer(value) === normalizeAnswer(question.answer);
  return clean(value) === clean(question.answer);
}

function choiceQuestion({ tag, prompt, sub, answer, pool, banned, word, extra }) {
  const distractors = takeDistinct(
    pool,
    Math.max(0, 3 - (extra ? extra.length : 0)),
    new Set([...(banned || []), answer])
  );
  const options = shuffle([answer, ...(extra || []), ...distractors]);
  if (options.length < 2) return null;
  return { tag, kind: "choice", prompt, sub, answer, options, word };
}

function synonymQuestion(word, all) {
  const own = listOf(word.synonyms);
  if (!own.length || !clean(word.term)) return null;
  const answer = pick(own);
  const banned = new Set([...own, ...listOf(word.antonyms)]);
  const pool = all.flatMap((w) => [...listOf(w.synonyms), ...listOf(w.antonyms)]);
  return choiceQuestion({
    tag: "Synonym",
    prompt: word.term,
    sub: "Which word means the same thing?",
    answer,
    pool,
    banned,
    word: word.term,
  });
}

function antonymQuestion(word, all) {
  const own = listOf(word.antonyms);
  if (!own.length || !clean(word.term)) return null;
  const answer = pick(own);
  const banned = new Set([...own, ...listOf(word.synonyms)]);
  const pool = all.flatMap((w) => [...listOf(w.antonyms), ...listOf(w.synonyms)]);
  return choiceQuestion({
    tag: "Antonym",
    prompt: word.term,
    sub: "Which word means the opposite?",
    answer,
    pool,
    banned,
    word: word.term,
  });
}

function definitionQuestion(word, all) {
  if (!clean(word.term) || !clean(word.definition)) return null;
  const pool = all.filter((w) => w !== word).map((w) => clean(w.definition));
  return choiceQuestion({
    tag: "Definition",
    prompt: word.term,
    sub: "Which definition matches this word?",
    answer: clean(word.definition),
    pool,
    banned: new Set([clean(word.definition)]),
    word: word.term,
  });
}

function maskedHint(term) {
  const chars = clean(term).toLowerCase().split("");
  return chars
    .map((char, i) => {
      if (char === " " || char === "-") return char;
      return i === 0 ? char : "_";
    })
    .join(" ");
}

function spellingQuestion(word) {
  const term = clean(word.term);
  if (!term) return null;
  return {
    tag: "Spelling",
    kind: "type",
    prompt: clean(word.definition) || "Spell the word that fits.",
    sub: "Type the word that matches this definition.",
    hint: "",
    answer: term,
    word: term,
  };
}

function rootGroups(all) {
  const groups = new Map();
  all.forEach((word) => {
    const root = clean(word.root).toLowerCase();
    if (!root || !clean(word.term)) return;
    if (!groups.has(root)) {
      groups.set(root, {
        root: clean(word.root),
        meaning: clean(word.rootMeaning),
        words: [],
      });
    }
    groups.get(root).words.push(word);
  });
  return Array.from(groups.values());
}

function rootQuestion(group, all) {
  const answerWord = pick(group.words);
  const others = all
    .filter((w) => clean(w.root).toLowerCase() !== group.root.toLowerCase())
    .map((w) => clean(w.term));
  return choiceQuestion({
    tag: "Roots",
    prompt: group.meaning ? `${group.root} — ${group.meaning}` : group.root,
    sub: "Which word is built on this root?",
    answer: clean(answerWord.term),
    pool: others,
    banned: new Set(group.words.map((w) => clean(w.term))),
    word: clean(answerWord.term),
  });
}

const BUILDERS = {
  synonyms: (words) => words.map((w) => synonymQuestion(w, words)),
  antonyms: (words) => words.map((w) => antonymQuestion(w, words)),
  definitions: (words) => words.map((w) => definitionQuestion(w, words)),
  spelling: (words) => words.map((w) => spellingQuestion(w)),
  roots: (words) => rootGroups(words).map((g) => rootQuestion(g, words)),
  mixed: (words) =>
    words.map((word) => {
      const kinds = [definitionQuestion, spellingQuestion];
      if (listOf(word.synonyms).length) kinds.push(synonymQuestion);
      if (listOf(word.antonyms).length) kinds.push(antonymQuestion);
      return pick(kinds)(word, words);
    }),
};

export function buildQuestions(words, mode) {
  if (!Array.isArray(words) || !words.length) return [];
  const builder = BUILDERS[mode] || BUILDERS.mixed;
  return builder(words).filter(Boolean);
}

export function countQuestion(words, mode) {
  if (!Array.isArray(words) || !words.length) return 0;
  switch (mode) {
    case "synonyms":
      return words.filter((w) => listOf(w.synonyms).length).length;
    case "antonyms":
      return words.filter((w) => listOf(w.antonyms).length).length;
    case "definitions":
      return words.filter((w) => clean(w.term) && clean(w.definition)).length;
    case "spelling":
      return words.filter((w) => clean(w.term)).length;
    case "roots":
      return rootGroups(words).length;
    case "mixed":
    default:
      return words.filter((w) => clean(w.term)).length;
  }
}

export function unitsOf(words) {
  return Array.from(new Set((words || []).map((w) => clean(w.unit)).filter(Boolean)));
}

// A selection of lessons travels as one search param joined by "|".
export function unitsParam(names) {
  return Array.from(new Set((names || []).filter(Boolean))).join("|");
}

export function unitsLabel(param) {
  return String(param || "")
    .split("|")
    .map((name) => name.trim())
    .filter(Boolean)
    .join(" · ");
}

export function scopeWords(words, param) {
  const all = words || [];
  const names = String(param || "")
    .split("|")
    .map((name) => name.trim())
    .filter(Boolean);
  if (!names.length) return all;
  return all.filter((word) => names.includes(clean(word.unit)));
}