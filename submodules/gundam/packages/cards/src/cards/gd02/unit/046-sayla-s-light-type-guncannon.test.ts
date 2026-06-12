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
import { gd02SaylaSLightTypeGuncannon046 } from "./046-sayla-s-light-type-guncannon.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("SGC-R"),
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
    cardNumber: uid("SGC-U"),
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

describe("Sayla's Light-Type Guncannon (GD02-046)", () => {
  describe("【Deploy】Choose 1 enemy Unit token. Deal 2 damage to it.", () => {
    it("deals 2 damage to a chosen enemy unit token on deploy", () => {
      const enemyToken = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd02SaylaSLightTypeGuncannon046], resourceArea: resources(4) },
        { play: [enemyToken] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [tokenId] = p2.getCardsInZone("battleArea");

      engine.markAsToken(tokenId!);

      expectSuccess(p1.deployUnit(gd02SaylaSLightTypeGuncannon046, { targets: [tokenId!] }));
      expect(p1.getDamage(tokenId!)).toBe(2);
    });

    it("cannot target a non-token enemy unit", () => {
      const nonTokenEnemy = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd02SaylaSLightTypeGuncannon046], resourceArea: resources(4) },
        { play: [nonTokenEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02SaylaSLightTypeGuncannon046, { targets: [enemyId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("cannot target a friendly unit", () => {
      const friendly = makeUnit(3);
      const engine = GundamTestEngine.create(
        {
          hand: [gd02SaylaSLightTypeGuncannon046],
          resourceArea: resources(4),
          play: [friendly],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      const result = p1.deployUnit(gd02SaylaSLightTypeGuncannon046, { targets: [friendlyId!] });
      expectFailure(result, "INVALID_TARGET");
    });
  });
});
