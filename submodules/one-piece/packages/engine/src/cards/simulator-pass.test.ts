import { describe, expect, test } from "vite-plus/test";
import * as cardExports from "@tcg/op-cards";

import { OnePieceTestEngine } from "../index.ts";

// Catalog-wide per-card simulator pass: every non-DON canonical card must
// build a fixture and encode a simulator URL without opening the browser.
// Leader ids were previously double-covered by set-local passes; this file
// is the authoritative whole-catalog sweep.

type AnyCard = {
  id: string;
  canonicalId?: string;
  cardType: string;
};

function isCard(value: unknown): value is AnyCard {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as AnyCard).id === "string" &&
    "cardType" in value
  );
}

const catalog = Object.values(cardExports as Record<string, unknown>).filter(isCard);
const byCanonical = new Map<string, AnyCard>();
for (const card of catalog) {
  if (card.cardType === "don") continue;
  const key = card.canonicalId || card.id;
  if (!byCanonical.has(key)) byCanonical.set(key, card);
}

function fixtureFor(card: AnyCard): Parameters<typeof OnePieceTestEngine.create>[0] {
  const cid = (card.canonicalId || card.id).split("_")[0]!;
  switch (card.cardType) {
    case "leader":
      return { leaderCardId: cid, activeDon: 5 };
    case "stage":
      return { stage: { cardId: cid }, activeDon: 5 };
    case "event":
      return { hand: [cid], activeDon: 5 };
    default:
      return {
        character: [{ cardId: cid, rested: true }],
        activeDon: 5,
      };
  }
}

describe("Catalog-wide simulator pass", () => {
  const entries = [...byCanonical.values()].sort((a, b) => a.id.localeCompare(b.id));

  test("catalog coverage is non-trivial", () => {
    expect(entries.length).toBeGreaterThan(1000);
  });

  for (const card of entries) {
    test(`${card.id} ${card.cardType} encodes simulator state`, () => {
      const engine = OnePieceTestEngine.create(fixtureFor(card), {
        character: ["OP16-012"],
        activeDon: 5,
      });
      const result = engine.openInSimulator({ open: false });
      expect(result).toBeDefined();
      expect(typeof result.url).toBe("string");
      expect((result.url as string).length).toBeGreaterThan(0);
    });
  }
});
