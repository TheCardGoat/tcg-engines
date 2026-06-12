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
import { hasKeywordGrant } from "@tcg/gundam-engine";
import { gd02GundamAshtaronMaMode042 } from "./042-gundam-ashtaron-ma-mode.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("GAM-R"),
    name: "Test Resource",
    type: "resource",
    traits: [],
    level: 0,
    cost: 0,
    keywordEffects: [],
    rarity: "common",
  };
}

function makeUnit(hp: number, traits: string[] = []): UnitCard {
  return {
    cardNumber: uid("GAM-U"),
    name: "Test Unit",
    type: "unit",
    traits,
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

describe("Gundam Ashtaron (MA Mode) (GD02-042)", () => {
  describe("【Deploy】Choose 1 of your (New UNE) Units. It gains <High-Maneuver> during this turn.", () => {
    it("grants HighManeuver to a chosen friendly New UNE unit on deploy", () => {
      const newUneUnit = makeUnit(3, ["new une"]);
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GundamAshtaronMaMode042],
          resourceArea: resources(3),
          play: [newUneUnit],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd02GundamAshtaronMaMode042, { targets: [unitId!] }));
      expect(hasKeywordGrant(engine, unitId!, "HighManeuver")).toBe(true);
    });

    it("cannot target a non-New UNE friendly unit", () => {
      const nonUne = makeUnit(3, ["earth federation"]);
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GundamAshtaronMaMode042],
          resourceArea: resources(3),
          play: [nonUne],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02GundamAshtaronMaMode042, { targets: [unitId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("cannot target an enemy unit even if it has the New UNE trait", () => {
      const enemyUne = makeUnit(3, ["new une"]);
      const engine = GundamTestEngine.create(
        { hand: [gd02GundamAshtaronMaMode042], resourceArea: resources(3) },
        { play: [enemyUne] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02GundamAshtaronMaMode042, { targets: [enemyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
