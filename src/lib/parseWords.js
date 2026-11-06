const splitList = (value) =>
  String(value || "")
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean);

// One word per line. Columns separated by a tab (paste from a doc or sheet) or a pipe.
// term | definition | synonyms | antonyms
export function parseWordBlock(text) {
  const rows = [];
  const problems = [];

  String(text || "")
    .split(/\r?\n/)
    .forEach((raw) => {
      const line = raw.trim();
      if (!line) return;

      const cells = (line.includes("\t") ? line.split("\t") : line.split("|")).map((c) => c.trim());
      if (cells.length < 2) {
        problems.push(line);
        return;
      }

      const [term, definition = "", syn = "", ant = ""] = cells;
      if (!term) return;
      if (term.toLowerCase() === "term" && definition.toLowerCase() === "definition") return;

      rows.push({
        term,
        definition,
        synonyms: splitList(syn),
        antonyms: splitList(ant),
      });
    });

  return { rows, problems };
}

export const SAMPLE_IMPORT = `benevolent | kind and wanting to help others | kindhearted, generous | cruel, spiteful
benediction | a blessing spoken at the end of a service | blessing | curse
malady | a disease or unhealthy condition | ailment, sickness | wellness`;