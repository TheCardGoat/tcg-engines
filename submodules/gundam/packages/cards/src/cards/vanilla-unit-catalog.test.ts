import { describe, expect, it } from "vite-plus/test";
import type { Card, UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import * as cardExports from "./index.ts";

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    "canonicalId" in value &&
    "type" in value
  );
}

function isVanillaUnit(card: Card): card is UnitCard {
  return (
    card.type === "unit" &&
    !card.cardNumber.startsWith("T-") &&
    (card.effects?.length ?? 0) === 0 &&
    card.keywordEffects.length === 0
  );
}

function isVanillaUnitToken(card: Card): card is UnitCard {
  return (
    card.type === "unit" &&
    card.cardNumber.startsWith("T-") &&
    (card.effects?.length ?? 0) === 0 &&
    card.keywordEffects.length === 0
  );
}

const canonicalCards = new Map<string, Card>();
for (const value of Object.values(cardExports)) {
  if (isCard(value)) canonicalCards.set(value.canonicalId, value);
}

const vanillaUnits = [...canonicalCards.values()]
  .filter(isVanillaUnit)
  .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber, "en", { numeric: true }));

const vanillaUnitTokens = [...canonicalCards.values()]
  .filter(isVanillaUnitToken)
  .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber, "en", { numeric: true }));

describe("canonical vanilla Unit catalog", () => {
  it("contains all 93 canonical non-token vanilla Units", () => {
    expect(vanillaUnits).toHaveLength(93);
  });

  describe.each(vanillaUnits)("$name ($cardNumber)", (card) => {
    it("pays its printed cost and deploys with its visible printed stats", () => {
      const engine = GundamTestEngine.create({
        hand: [card],
        resourceArea: activeResources(Math.max(card.level, card.cost)),
      });
      const player = engine.asPlayer(PLAYER_ONE);

      expectSuccess(player.deployUnit(card));

      const deployedId = player.getCardsInZone("battleArea")[0];
      expect(deployedId).toBeDefined();
      expect(player.getCardZone(deployedId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(player.getHand()).toHaveLength(0);
      expect(player.getVisibleCard(deployedId!)).toMatchObject({
        definitionId: card.cardNumber,
        effectiveAp: card.ap,
        effectiveHp: card.hp,
        exhausted: false,
      });
    });

    it("rejects deployment when its printed active-resource cost cannot be paid", () => {
      const activeCount = Math.max(0, card.cost - 1);
      const resourceCount = Math.max(card.level, card.cost);
      const engine = GundamTestEngine.create({
        hand: [card],
        resourceArea: [
          ...activeResources(activeCount),
          ...restedResources(resourceCount - activeCount),
        ],
      });

      expectFailure(engine.asPlayer(PLAYER_ONE).deployUnit(card), "INSUFFICIENT_RESOURCES");
    });
  });
});

describe("canonical vanilla Unit token catalog", () => {
  it("contains all 17 canonical vanilla Unit tokens", () => {
    expect(vanillaUnitTokens).toHaveLength(17);
  });

  describe.each(vanillaUnitTokens)("$name ($cardNumber)", (card) => {
    it("enters combat with its visible printed stats", () => {
      const engine = GundamTestEngine.create({
        play: [{ card, isToken: true }],
      });
      const player = engine.asPlayer(PLAYER_ONE);
      const tokenId = player.getCardsInZone("battleArea")[0];

      expect(tokenId).toBeDefined();
      expect(player.getVisibleCard(tokenId!)).toMatchObject({
        definitionId: card.cardNumber,
        effectiveAp: card.ap,
        effectiveHp: card.hp,
        exhausted: false,
      });

      expectSuccess(player.enterBattle(tokenId!, "direct"));
      expect(player.getBoardView().pendingCombat).toMatchObject({ attackerId: tokenId });
    });
  });
});
