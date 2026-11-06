const splitList = (value) =>
  String(value || "")
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean);

// One word per line. Columns separated by a tab (paste from a doc or sheet) or a pipe.
// term | definition | synonyms | antonyms | root | root meaning
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

      const [term, definition = "", syn = "", ant = "", rootCell = "", meaningCell = ""] = cells;
      if (!term) return;
      if (term.toLowerCase() === "term" && definition.toLowerCase() === "definition") return;

      let root = rootCell;
      let rootMeaning = meaningCell;
      if (root && root.includes("=") && !rootMeaning) {
        const [r, m] = root.split("=");
        root = r.trim();
        rootMeaning = m.trim();
      }

      rows.push({
        term,
        definition,
        synonyms: splitList(syn),
        antonyms: splitList(ant),
        root,
        rootMeaning,
      });
    });

  return { rows, problems };
}

export const SAMPLE_IMPORT = `benevolent | kind and wanting to help others | kindhearted, generous | cruel, spiteful | bene = good
benediction | a blessing spoken at the end of a service | blessing | curse | bene = good
malady | a disease or unhealthy condition | ailment, sickness | wellness | mal = bad`;