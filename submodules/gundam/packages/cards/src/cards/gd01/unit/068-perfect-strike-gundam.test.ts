import { describe, it, expect } from "vite-plus/test";
import type { UnitCard, ResourceCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectAttackRedirectedTo,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { gd01PerfectStrikeGundam068 } from "./068-perfect-strike-gundam.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("PSG-R"),
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
    cardNumber: uid("PSG-U"),
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

describe("Perfect Strike Gundam (GD01-068)", () => {
  it("<Blocker> lets Perfect Strike Gundam intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, gd01PerfectStrikeGundam068] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));
    expectAttackRedirectedTo(engine, blockerId);
  });

  describe("【Deploy】Choose 1 enemy Unit. Return it to its owner's hand.", () => {
    it("returns a chosen enemy unit to its owner's hand on deploy", () => {
      const enemy = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01PerfectStrikeGundam068], resourceArea: resources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd01PerfectStrikeGundam068, { targets: [enemyId!] }));
      expect(p2.getCardsInZone("battleArea")).not.toContain(enemyId);
      expect(p2.getCardsInZone("hand")).toContain(enemyId);
    });

    it("cannot target a friendly unit", () => {
      const friendly = makeUnit(3);
      const engine = GundamTestEngine.create(
        {
          hand: [gd01PerfectStrikeGundam068],
          resourceArea: resources(5),
          play: [friendly],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd01PerfectStrikeGundam068, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
