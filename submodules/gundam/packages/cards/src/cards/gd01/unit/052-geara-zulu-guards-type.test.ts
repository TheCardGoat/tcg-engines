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
import { gd01GearaZuluGuardsType052 } from "./052-geara-zulu-guards-type.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("GZ-R"),
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
    cardNumber: uid("GZ-U"),
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

describe("Geara Zulu (Guards Type) (GD01-052)", () => {
  describe("【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to a chosen enemy unit on deploy", () => {
      const enemy = makeUnit(4);
      const engine = GundamTestEngine.create(
        { hand: [gd01GearaZuluGuardsType052], resourceArea: resources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01GearaZuluGuardsType052, { targets: [enemyId!] }));
      expect(p1.getDamage(enemyId!)).toBe(1);
    });

    it("cannot target a friendly unit", () => {
      const friendly = makeUnit(3);
      const engine = GundamTestEngine.create(
        {
          hand: [gd01GearaZuluGuardsType052],
          resourceArea: resources(4),
          play: [friendly],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd01GearaZuluGuardsType052, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("deals damage only to the chosen enemy when multiple exist", () => {
      const e1 = makeUnit(3);
      const e2 = makeUnit(4);
      const engine = GundamTestEngine.create(
        { hand: [gd01GearaZuluGuardsType052], resourceArea: resources(4) },
        { play: [e1, e2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [e1Id, e2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01GearaZuluGuardsType052, { targets: [e1Id!] }));
      expect(p1.getDamage(e1Id!)).toBe(1);
      expect(p1.getDamage(e2Id!)).toBe(0);
    });
  });
});
