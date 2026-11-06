import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getServerInfo = createServerFn({ method: "GET" }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}));

export const listWords = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const page = await context
    .getBase44()
    .entities.VocabWord.filter({}, { sort: "unit", limit: 500 });
  return page.items || [];
});

const wordData = z.object({
  term: z.string().trim().min(1).max(80),
  partOfSpeech: z.string().trim().max(20).optional().default(""),
  definition: z.string().trim().max(500).optional().default(""),
  synonyms: z.array(z.string().trim().min(1).max(60)).max(40).optional().default([]),
  antonyms: z.array(z.string().trim().min(1).max(60)).max(40).optional().default([]),
});

export const saveWord = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1).optional(),
      unit: z.string().trim().min(1).max(60),
      word: wordData,
    })
  )
  .handler(async ({ data, context }) => {
    const entities = context.getBase44().entities.VocabWord;
    const payload = { unit: data.unit, ...data.word };
    if (data.id) return entities.update(data.id, payload);
    return entities.create(payload);
  });

export const importWords = createServerFn({ method: "POST" })
  .validator(
    z.object({
      unit: z.string().trim().min(1).max(60),
      words: z.array(wordData).min(1).max(300),
    })
  )
  .handler(async ({ data, context }) => {
    const rows = data.words.map((word) => ({ unit: data.unit, ...word }));
    const created = await context.getBase44().entities.VocabWord.bulkCreate(rows);
    return { count: rows.length, created: created?.length ?? rows.length };
  });

export const deleteWord = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    await context.getBase44().entities.VocabWord.delete(data.id);
    return { ok: true };
  });

export const deleteUnit = createServerFn({ method: "POST" })
  .validator(z.object({ unit: z.string().trim().min(1).max(60) }))
  .handler(async ({ data, context }) => {
    await context.getBase44().entities.VocabWord.deleteMany({ unit: data.unit });
    return { ok: true };
  });