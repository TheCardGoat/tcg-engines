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
import { gd01Anksha020 } from "./020-anksha.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("ANK-R"),
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
    cardNumber: uid("ANK-U"),
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

describe("Anksha (GD01-020)", () => {
  describe("【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to a chosen rested enemy unit on deploy", () => {
      const restedEnemy = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01Anksha020], resourceArea: resources(4) },
        { play: [{ card: restedEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01Anksha020, { targets: [enemyId!] }));
      expect(p1.getDamage(enemyId!)).toBe(1);
    });

    it("cannot target an active (non-rested) enemy unit", () => {
      const activeEnemy = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01Anksha020], resourceArea: resources(4) },
        { play: [activeEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd01Anksha020, { targets: [enemyId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("cannot target a friendly unit even if rested", () => {
      const friendly = makeUnit(3);
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Anksha020],
          resourceArea: resources(4),
          play: [{ card: friendly, exhausted: true }],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd01Anksha020, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
