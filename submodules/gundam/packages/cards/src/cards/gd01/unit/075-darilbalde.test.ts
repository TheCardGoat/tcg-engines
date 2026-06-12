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
import { gd01Darilbalde075 } from "./075-darilbalde.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("DAR-R"),
    name: "Test Resource",
    type: "resource",
    traits: [],
    level: 0,
    cost: 0,
    keywordEffects: [],
    rarity: "common",
  };
}

function makeUnit(hp: number): UnitCard {
  return {
    cardNumber: uid("DAR-U"),
    name: "Test Unit",
    type: "unit",
    traits: [],
    level: 1,
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

describe("Darilbalde (GD01-075)", () => {
  describe("【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.", () => {
    it("returns a chosen enemy unit with 1 HP to its owner's hand", () => {
      const weakEnemy = makeUnit(1);
      const engine = GundamTestEngine.create(
        { hand: [gd01Darilbalde075], resourceArea: resources(3) },
        { play: [weakEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01Darilbalde075, { targets: [enemyId!] }));
      expect(p2.getCardsInZone("battleArea")).not.toContain(enemyId);
      expect(p2.getCardsInZone("hand")).toContain(enemyId);
    });

    it("cannot target an enemy unit with more than 1 HP", () => {
      const toughEnemy = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01Darilbalde075], resourceArea: resources(3) },
        { play: [toughEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd01Darilbalde075, { targets: [enemyId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("cannot target a friendly unit even with 1 HP", () => {
      const friendly = makeUnit(1);
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Darilbalde075],
          resourceArea: resources(3),
          play: [friendly],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd01Darilbalde075, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
