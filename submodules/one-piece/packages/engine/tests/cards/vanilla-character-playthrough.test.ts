import { readFileSync } from "node:fs";
import { getCard } from "@tcg/op-cards";
import type { CharacterCard } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

/**
 * User-like smoke for every vanilla Character: the player pays DON!! and plays
 * the card from hand; no ability prompt appears.
 */

const inventory = readFileSync(
  new URL("../../../../docs/card-behavior-character-inventory.md", import.meta.url),
  "utf8",
);
const vanillaCharacterIds = inventory
  .split("\n")
  .map((line) => /^\|\s*([^|]+?)\s*\|[^|]*\|\s*vanilla\s*\|/.exec(line)?.[1]?.trim())
  .filter((id): id is string => Boolean(id));

describe("vanilla Character play-through", () => {
  test.each(vanillaCharacterIds)("player plays %s from hand without ability prompts", (cardId) => {
    const card = getCard(cardId) as CharacterCard;
    expect(card.cardType).toBe("character");

    const engine = OnePieceTestEngine.create({
      hand: [card],
      activeDon: card.cost,
    });

    engine.play(card);

    const view = engine.getView("south").players.south;
    expect(view.characters.some((entry) => entry?.cardId === card.id)).toBe(true);
    expect(view.restedDon).toBe(card.cost);
    expect(view.activeDon).toBe(0);
    expect(engine.hasPendingChoice("south")).toBe(false);
  });
});
