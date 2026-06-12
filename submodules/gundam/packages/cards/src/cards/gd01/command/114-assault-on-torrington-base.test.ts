import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockResource,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { gd01AssaultOnTorringtonBase114 } from "./114-assault-on-torrington-base.ts";

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

function countApModifiers(
  effects: Array<{ targetId: string; payload: { kind: string; stat?: string; modifier?: number } }>,
  targetId: string,
): number {
  return effects.filter(
    (e) => e.targetId === targetId && e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
  ).length;
}

describe("Assault on Torrington Base (GD01-114)", () => {
  describe("【Action】Choose 2 friendly Units. They get AP+1 during this turn.", () => {
    it("applies AP+1 modifier to 2 chosen friendly units during action-phase", () => {
      const u1 = createMockUnit({ ap: 2, hp: 3 });
      const u2 = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01AssaultOnTorringtonBase114],
        play: [u1, u2],
        resourceArea: resources(2),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1Id, u2Id] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01AssaultOnTorringtonBase114, { targets: [u1Id!, u2Id!] }));
      const effects = engine.getG().continuousEffects as Array<{
        targetId: string;
        payload: { kind: string; stat?: string; modifier?: number };
      }>;
      expect(countApModifiers(effects, u1Id!)).toBe(1);
      expect(countApModifiers(effects, u2Id!)).toBe(1);
      const mod1 = effects.find(
        (e) => e.targetId === u1Id && e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
      expect(mod1!.payload.modifier).toBe(1);
      const mod2 = effects.find(
        (e) => e.targetId === u2Id && e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
      expect(mod2!.payload.modifier).toBe(1);
    });

    it("cannot be played during main-phase (action timing only)", () => {
      const u1 = createMockUnit({ ap: 2, hp: 3 });
      const u2 = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01AssaultOnTorringtonBase114],
        play: [u1, u2],
        resourceArea: resources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1Id, u2Id] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01AssaultOnTorringtonBase114, { targets: [u1Id!, u2Id!] }),
        "WRONG_TIMING",
      );
    });

    it("moves the command card to trash after resolution", () => {
      const u1 = createMockUnit({ ap: 2, hp: 3 });
      const u2 = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01AssaultOnTorringtonBase114],
        play: [u1, u2],
        resourceArea: resources(2),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1Id, u2Id] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01AssaultOnTorringtonBase114, { targets: [u1Id!, u2Id!] }));
      const zoneKey = engine.getState().ctx.zones.private.cardIndex[cmdId]?.zoneKey;
      expect(zoneKey).toBe(`trash:${p1.playerId}`);
    });

    it("must target exactly 2 units", () => {
      const u1 = createMockUnit({ ap: 2, hp: 3 });
      const u2 = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01AssaultOnTorringtonBase114],
        play: [u1, u2],
        resourceArea: resources(2),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1Id] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01AssaultOnTorringtonBase114, { targets: [u1Id!] }),
        "INVALID_TARGET",
      );
    });
  });
});
