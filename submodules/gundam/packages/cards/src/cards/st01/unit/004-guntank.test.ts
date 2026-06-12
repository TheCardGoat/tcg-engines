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
import { st01Guntank004 } from "./004-guntank.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("STG-R"),
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
    cardNumber: uid("STG-U"),
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

describe("Guntank (ST01-004)", () => {
  describe("【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.", () => {
    it("rests a chosen enemy unit with 2 or less HP on deploy", () => {
      const weakEnemy = makeUnit(2);
      const engine = GundamTestEngine.create(
        { hand: [st01Guntank004], resourceArea: resources(3) },
        { play: [weakEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(st01Guntank004, { targets: [enemyId!] }));
      expect(engine.getG().exhausted[enemyId!]).toBe(true);
    });

    it("cannot target an enemy unit with more than 2 HP", () => {
      const toughEnemy = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [st01Guntank004], resourceArea: resources(3) },
        { play: [toughEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      const result = p1.deployUnit(st01Guntank004, { targets: [enemyId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("cannot target a friendly unit even with 2 or less HP", () => {
      const friendly = makeUnit(2);
      const engine = GundamTestEngine.create(
        {
          hand: [st01Guntank004],
          resourceArea: resources(3),
          play: [friendly],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(st01Guntank004, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("rests only the chosen enemy when multiple valid targets exist", () => {
      const e1 = makeUnit(2);
      const e2 = makeUnit(2);
      const engine = GundamTestEngine.create(
        { hand: [st01Guntank004], resourceArea: resources(3) },
        { play: [e1, e2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [e1Id, e2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(st01Guntank004, { targets: [e1Id!] }));
      expect(engine.getG().exhausted[e1Id!]).toBe(true);
      expect(engine.getG().exhausted[e2Id!] ?? false).toBe(false);
    });
  });
});
