import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import type { CardDefinition, SetCode } from "@tcg/cyberpunk-types";

interface GeneratedCardModule {
  cards: CardDefinition[];
}

function sanitizeGeneratedModule(source: string): string {
  return source
    .replace(/^import type .*$/gm, "")
    .replace(/export const rawCards =/g, "const rawCards =")
    .replace(/export const cards =/g, "const cards =")
    .replace(/\]\s+satisfies\s+RawCardRecord\[\];/g, "];")
    .replace(/\]\s+satisfies\s+CardDefinition\[\];/g, "];");
}

export async function loadGeneratedCardModule(filePath: string): Promise<GeneratedCardModule> {
  const source = await readFile(filePath, "utf8");
  const sanitized = sanitizeGeneratedModule(source);
  const namespace = runInNewContext(
    `${sanitized}

({
  cards,
});`,
  ) as {
    cards: unknown;
  };

  return {
    cards: JSON.parse(JSON.stringify(namespace.cards)) as CardDefinition[],
  };
}

export async function loadGeneratedCards(filePath: string): Promise<CardDefinition[]> {
  const { cards } = await loadGeneratedCardModule(filePath);

  return cards;
}

export async function loadGeneratedSetCards(
  filePath: string,
  setCode: SetCode,
): Promise<CardDefinition[]> {
  const cards = await loadGeneratedCards(filePath);

  return cards.filter((card) => card.set.code === setCode);
}

export async function loadGeneratedAlphaCards(filePath: string): Promise<CardDefinition[]> {
  return loadGeneratedSetCards(filePath, "alpha");
}

export async function loadGeneratedSpoilerCards(filePath: string): Promise<CardDefinition[]> {
  return loadGeneratedSetCards(filePath, "spoiler");
}

export async function loadGeneratedPromoCards(filePath: string): Promise<CardDefinition[]> {
  return loadGeneratedSetCards(filePath, "promo");
}
