import * as path from "node:path";
import * as fs from "node:fs/promises";
import { structuredCards } from "@tcg/cyberpunk-cards";
import type { CardDefinition } from "@tcg/cyberpunk-types";

const CARD_DIRECTORY_BY_TYPE = {
  legend: "legends",
  unit: "units",
  gear: "gear",
  program: "programs",
} as const;

const REPO_REL_CARDS_ROOT = "packages/cards/src";
const ABS_CARDS_ROOT = path.resolve(import.meta.dirname, "../../../packages/cards/src");

export interface ResolvedCard {
  defId: string;
  displayName: string;
  slug: string;
  set: string;
  cardType: string;
  filePath: string | null;
}

const cardsByLookup = new Map<string, CardDefinition>(
  structuredCards.flatMap((card) => [
    [card.id, card as CardDefinition],
    [card.slug, card as CardDefinition],
  ]),
);

async function fileExists(absPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(absPath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function resolveFilePath(card: CardDefinition): Promise<string | null> {
  const dir = CARD_DIRECTORY_BY_TYPE[card.type];
  const rel = `${REPO_REL_CARDS_ROOT}/${card.set.code}/${dir}/${card.slug}.ts`;
  if (await fileExists(path.join(ABS_CARDS_ROOT, card.set.code, dir, `${card.slug}.ts`))) {
    return rel;
  }

  const absDir = path.join(ABS_CARDS_ROOT, card.set.code, dir);
  try {
    const candidates = await fs.readdir(absDir);
    const match = candidates.find((file) => file.endsWith(".ts") && file.includes(card.slug));
    return match ? `${REPO_REL_CARDS_ROOT}/${card.set.code}/${dir}/${match}` : null;
  } catch {
    return null;
  }
}

export async function resolveDefIds(defIds: Iterable<string>): Promise<Map<string, ResolvedCard>> {
  const out = new Map<string, ResolvedCard>();

  for (const defId of defIds) {
    const card = cardsByLookup.get(defId);
    if (!card) {
      out.set(defId, {
        defId,
        displayName: "<unknown>",
        slug: "<unknown>",
        set: "?",
        cardType: "?",
        filePath: null,
      });
      continue;
    }

    out.set(defId, {
      defId,
      displayName: card.displayName,
      slug: card.slug,
      set: card.set.code,
      cardType: card.type,
      filePath: await resolveFilePath(card),
    });
  }

  return out;
}
