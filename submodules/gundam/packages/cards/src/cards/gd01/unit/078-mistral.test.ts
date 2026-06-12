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
import { gd01Mistral078 } from "./078-mistral.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("MIS-R"),
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
    cardNumber: uid("MIS-U"),
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

describe("Mistral (GD01-078)", () => {
  describe("【Deploy】Choose 1 enemy Unit. It gets AP-1 during this turn.", () => {
    it("applies AP-1 to a chosen enemy unit on deploy", () => {
      const enemy = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01Mistral078], resourceArea: resources(1) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01Mistral078, { targets: [enemyId!] }));
      const mod = findStatModifier(engine, enemyId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(-1);
    });

    it("cannot target a friendly unit", () => {
      const friendly = makeUnit(3);
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Mistral078],
          resourceArea: resources(1),
          play: [friendly],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd01Mistral078, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
