import { describe, it, expect } from "vite-plus/test";
import type { ResourceCard } from "@tcg/gundam-types";
import { GundamTestEngine, PLAYER_ONE, expectSuccess } from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { gd02GundamBarbatos3rdForm068 } from "./068-gundam-barbatos-3rd-form.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("BAR-R"),
    name: "Test Resource",
    type: "resource",
    traits: [],
    level: 0,
    cost: 0,
    keywordEffects: [],
    rarity: "common",
  };
}

function active(card: ResourceCard): TestCardEntry {
  return { card, exhausted: false };
}

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(makeResource()));
}

describe("Gundam Barbatos 3rd Form (GD02-068)", () => {
  describe("【Deploy】Deal 2 damage to this Unit.", () => {
    it("deals 2 damage to itself on deploy", () => {
      const engine = GundamTestEngine.create(
        { hand: [gd02GundamBarbatos3rdForm068], resourceArea: resources(4) },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamBarbatos3rdForm068));

      const deployedCards = p1.getCardsInZone("battleArea");
      expect(deployedCards.length).toBe(1);
      expect(p1.getDamage(deployedCards[0]!)).toBe(2);
    });
  });
});
