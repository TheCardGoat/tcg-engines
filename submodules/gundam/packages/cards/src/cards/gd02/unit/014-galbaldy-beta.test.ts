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
import { findStatModifier } from "@tcg/gundam-engine";
import { gd02GalbaldyBeta014 } from "./014-galbaldy-beta.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("GB-R"),
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
    cardNumber: uid("GB-U"),
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

describe("Galbaldy Beta (GD02-014)", () => {
  describe("【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.", () => {
    it("applies AP+1 to a chosen friendly Titans unit on deploy", () => {
      const titansUnit = makeUnit(3, ["titans"]);
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GalbaldyBeta014],
          resourceArea: resources(2),
          play: [titansUnit],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd02GalbaldyBeta014, { targets: [unitId!] }));
      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(1);
    });

    it("cannot target a non-Titans friendly unit", () => {
      const nonTitans = makeUnit(3, ["earth federation"]);
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GalbaldyBeta014],
          resourceArea: resources(2),
          play: [nonTitans],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02GalbaldyBeta014, { targets: [unitId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("cannot target an enemy unit even if it has the Titans trait", () => {
      const enemyTitans = makeUnit(3, ["titans"]);
      const engine = GundamTestEngine.create(
        { hand: [gd02GalbaldyBeta014], resourceArea: resources(2) },
        { play: [enemyTitans] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02GalbaldyBeta014, { targets: [enemyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
