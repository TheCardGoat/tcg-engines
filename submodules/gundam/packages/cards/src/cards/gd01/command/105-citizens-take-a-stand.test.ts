import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockResource,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { ContinuousEffectEntry, TestCardEntry } from "@tcg/gundam-engine";
import { gd01CitizensTakeAStand105 } from "./105-citizens-take-a-stand.ts";

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({ card: createMockResource(), exhausted: false }));
}

function makeUnit(): ReturnType<typeof createMockUnit> {
  return createMockUnit({ ap: 2, hp: 5 });
}

describe("Citizens, Take a Stand! (GD01-105)", () => {
  describe("【Main】All your Units get AP+2 during this turn.", () => {
    it("applies AP+2 to all friendly units", () => {
      const u1 = makeUnit();
      const u2 = makeUnit();
      const engine = GundamTestEngine.create({
        hand: [gd01CitizensTakeAStand105],
        resourceArea: resources(4),
        play: [u1, u2],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1Id, u2Id] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01CitizensTakeAStand105));

      const effects = engine.getG().continuousEffects;
      const u1Effects = effects.filter((e: ContinuousEffectEntry) => e.targetId === u1Id);
      const u2Effects = effects.filter((e: ContinuousEffectEntry) => e.targetId === u2Id);
      expect(u1Effects.length).toBe(1);
      expect(u1Effects[0]!.payload).toEqual({ kind: "stat-modifier", stat: "ap", modifier: 2 });
      expect(u2Effects.length).toBe(1);
      expect(u2Effects[0]!.payload).toEqual({ kind: "stat-modifier", stat: "ap", modifier: 2 });
    });

    it("does not affect enemy units", () => {
      const friendlyUnit = makeUnit();
      const enemyUnit = makeUnit();
      const engine = GundamTestEngine.create(
        { hand: [gd01CitizensTakeAStand105], resourceArea: resources(4), play: [friendlyUnit] },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd01CitizensTakeAStand105));

      const effects = engine.getG().continuousEffects;
      const enemyEffects = effects.filter((e: ContinuousEffectEntry) => e.targetId === enemyId);
      expect(enemyEffects.length).toBe(0);
    });

    it("moves the command card to trash after resolution", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01CitizensTakeAStand105],
        resourceArea: resources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01CitizensTakeAStand105));
      const zoneKey = engine.getState().ctx.zones.private.cardIndex[cmdId]?.zoneKey;
      expect(zoneKey).toBe(`trash:${p1.playerId}`);
    });

    it("cannot be played during action-phase", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01CitizensTakeAStand105],
        resourceArea: resources(4),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      const result = p1.playCommand(gd01CitizensTakeAStand105);
      expectFailure(result, "WRONG_TIMING");
    });

    it("works with 0 friendly units (no-op, card still moves to trash)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01CitizensTakeAStand105],
        resourceArea: resources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01CitizensTakeAStand105));

      const effects = engine.getG().continuousEffects;
      expect(effects.length).toBe(0);
      const zoneKey = engine.getState().ctx.zones.private.cardIndex[cmdId]?.zoneKey;
      expect(zoneKey).toBe(`trash:${p1.playerId}`);
    });
  });

  describe("【Burst】Add this card to your hand.", () => {
    it("adds this card to hand when burst resolves", () => {
      const engine = GundamTestEngine.create({}, { deck: [gd01CitizensTakeAStand105] });
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      if (!shieldId) throw new Error("seed failed");
      engine.fireShieldBurst(shieldId);
      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `hand:${PLAYER_TWO}`,
      );
    });
  });
});
