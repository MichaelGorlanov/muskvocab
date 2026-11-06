import { createServerFn } from "@tanstack/react-start";

export const getServerInfo = createServerFn({ method: "GET" }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}));

export const listWords = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const page = await context
    .getBase44()
    .entities.VocabWord.filter({}, { sort: "unit", limit: 500 });
  return page.items || [];
});