import { describe, it, expect } from "vite-plus/test";
import type { UnitCard, ResourceCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { gd02SugaiSGelgoogGq041 } from "./041-sugai-s-gelgoog-gq.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("SG-R"),
    name: "Test Resource",
    type: "resource",
    traits: [],
    level: 0,
    cost: 0,
    keywordEffects: [],
    rarity: "common",
  };
}

function makeUnit(hp: number, level: number): UnitCard {
  return {
    cardNumber: uid("SG-U"),
    name: "Test Unit",
    type: "unit",
    traits: [],
    level,
    cost: 1,
    keywordEffects: [],
    rarity: "common",
    ap: 1,
    hp,
  };
}

function active(card: ResourceCard): TestCardEntry {
  return { card, exhausted: false };
}

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(makeResource()));
}

describe("Sugai's Gelgoog (GQ) (GD02-041)", () => {
  describe("【Deploy】Choose 1 enemy Unit that is Lv.5 or higher. Deal 2 damage to it.", () => {
    it("deals 2 damage to a chosen enemy unit at level 5 or higher", () => {
      const highLevelEnemy = makeUnit(4, 5);
      const engine = GundamTestEngine.create(
        { hand: [gd02SugaiSGelgoogGq041], resourceArea: resources(4) },
        { play: [highLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd02SugaiSGelgoogGq041, { targets: [enemyId!] }));
      expect(p1.getDamage(enemyId!)).toBe(2);
    });

    it("cannot target an enemy unit below level 5", () => {
      const lowLevelEnemy = makeUnit(4, 3);
      const engine = GundamTestEngine.create(
        { hand: [gd02SugaiSGelgoogGq041], resourceArea: resources(4) },
        { play: [lowLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02SugaiSGelgoogGq041, { targets: [enemyId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("cannot target a friendly unit even at level 5 or higher", () => {
      const friendlyHigh = makeUnit(4, 5);
      const engine = GundamTestEngine.create(
        {
          hand: [gd02SugaiSGelgoogGq041],
          resourceArea: resources(4),
          play: [friendlyHigh],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02SugaiSGelgoogGq041, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
