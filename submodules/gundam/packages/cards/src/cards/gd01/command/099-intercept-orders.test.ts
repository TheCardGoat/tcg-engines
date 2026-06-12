/**
 * Intercept Orders (GD01-099) — card behavior tests
 *
 * The command effect is 【Main】/【Action】 "Choose 1 to 2 enemy Units with
 * 3 or less HP. Rest them." These tests verify that the test engine handles
 * the effect correctly in both timings.
 *
 * Burst behavior is asserted separately through the shield/burst pipeline.
 */

import { describe, it, expect } from "vite-plus/test";
import type { UnitCard, ResourceCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { gd01InterceptOrders099 } from "./099-intercept-orders.ts";

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

function makeResource(): ResourceCard {
  return {
    cardNumber: uid("IO-R"),
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
    cardNumber: uid("IO-U"),
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

describe("Intercept Orders (GD01-099)", () => {
  describe("【Main】/【Action】 Choose 1 to 2 enemy Units with 3 or less HP. Rest them.", () => {
    it("rests one chosen enemy unit during main-phase", () => {
      const u1 = makeUnit(3);
      const u2 = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: resources(4) },
        { play: [u1, u2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01InterceptOrders099, { targets: [u1Id!] }));
      expect(engine.getG().exhausted[u1Id!]).toBe(true);
      expect(engine.getG().exhausted[u2Id!] ?? false).toBe(false);
    });

    it("rests two chosen enemy units during main-phase", () => {
      const u1 = makeUnit(3);
      const u2 = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: resources(4) },
        { play: [u1, u2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01InterceptOrders099, { targets: [u1Id!, u2Id!] }));
      expect(engine.getG().exhausted[u1Id!]).toBe(true);
      expect(engine.getG().exhausted[u2Id!]).toBe(true);
    });

    it("rests the chosen enemy unit during action-phase", () => {
      const u1 = makeUnit(3);
      const u2 = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: resources(4) },
        { play: [u1, u2] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01InterceptOrders099, { targets: [u1Id!] }));
      expect(engine.getG().exhausted[u1Id!]).toBe(true);
      expect(engine.getG().exhausted[u2Id!] ?? false).toBe(false);
    });

    it("rests two chosen enemy units during action-phase", () => {
      const u1 = makeUnit(3);
      const u2 = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: resources(4) },
        { play: [u1, u2] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01InterceptOrders099, { targets: [u1Id!, u2Id!] }));
      expect(engine.getG().exhausted[u1Id!]).toBe(true);
      expect(engine.getG().exhausted[u2Id!]).toBe(true);
    });

    it("moves the command card to trash after resolution", () => {
      const u1 = makeUnit(3);
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: resources(4) },
        { play: [u1] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const u1Id = p2.getCardsInZone("battleArea")[0]!;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01InterceptOrders099, { targets: [u1Id] }));
      const zoneKey = engine.getState().ctx.zones.private.cardIndex[cmdId]?.zoneKey;
      expect(zoneKey).toBe(`trash:${p1.playerId}`);
    });
  });

  describe("【Burst】 Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    it("rests a valid enemy unit when the shield with this card is destroyed", () => {
      const validTarget = makeUnit(5);
      const engine = GundamTestEngine.create(
        { play: [validTarget] },
        { deck: [gd01InterceptOrders099] },
      );
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      if (!shieldId) throw new Error("seed failed");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      engine.fireShieldBurst(shieldId);

      const pending = engine.getPendingChoice();
      if (pending) {
        expectSuccess(p2.resolveEffect({ targets: [targetId] }));
      }

      expect(engine.getG().exhausted[targetId]).toBe(true);
    });
  });
});
