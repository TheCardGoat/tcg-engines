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
import { gd01NavalBombardment120 } from "./120-naval-bombardment.ts";

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({ card: createMockResource(), exhausted: false }));
}

describe("Naval Bombardment (GD01-120)", () => {
  describe("【Action】Choose 1 friendly Unit with <Blocker>. It gets AP+3 during this turn.", () => {
    it("applies AP+3 to a friendly unit with Blocker keyword", () => {
      const blockerUnit = createMockUnit({
        keywordEffects: [{ keyword: "Blocker" }],
        ap: 2,
        hp: 5,
      });
      const engine = GundamTestEngine.create({
        hand: [gd01NavalBombardment120],
        resourceArea: resources(2),
        play: [blockerUnit],
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01NavalBombardment120, { targets: [unitId!] }));

      const effects = engine.getG().continuousEffects;
      const unitEffects = effects.filter((e: ContinuousEffectEntry) => e.targetId === unitId);
      expect(unitEffects.length).toBe(1);
      expect(unitEffects[0]!.payload).toEqual({ kind: "stat-modifier", stat: "ap", modifier: 3 });
    });

    it("cannot target a friendly unit without Blocker keyword", () => {
      const nonBlockerUnit = createMockUnit({ keywordEffects: [], ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd01NavalBombardment120],
        resourceArea: resources(2),
        play: [nonBlockerUnit],
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      const result = p1.playCommand(gd01NavalBombardment120, { targets: [unitId!] });
      expectFailure(result, "INVALID_TARGET");
    });

    it("moves the command card to trash after resolution", () => {
      const blockerUnit = createMockUnit({
        keywordEffects: [{ keyword: "Blocker" }],
        ap: 2,
        hp: 5,
      });
      const engine = GundamTestEngine.create({
        hand: [gd01NavalBombardment120],
        resourceArea: resources(2),
        play: [blockerUnit],
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01NavalBombardment120, { targets: [unitId!] }));
      const zoneKey = engine.getState().ctx.zones.private.cardIndex[cmdId]?.zoneKey;
      expect(zoneKey).toBe(`trash:${p1.playerId}`);
    });

    it("cannot be played during main-phase", () => {
      const blockerUnit = createMockUnit({
        keywordEffects: [{ keyword: "Blocker" }],
        ap: 2,
        hp: 5,
      });
      const engine = GundamTestEngine.create({
        hand: [gd01NavalBombardment120],
        resourceArea: resources(2),
        play: [blockerUnit],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      const result = p1.playCommand(gd01NavalBombardment120);
      expectFailure(result, "WRONG_TIMING");
    });
  });

  describe("【Burst】Choose 1 enemy Unit. It gets AP-3 during this turn.", () => {
    it("applies AP-3 to a chosen enemy unit when burst resolves", () => {
      const enemyUnit = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [enemyUnit] },
        { deck: [gd01NavalBombardment120] },
      );
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      if (!shieldId) throw new Error("seed failed");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = p1.getCardsInZone("battleArea")[0]!;

      engine.fireShieldBurst(shieldId);

      // Burst firer (p2) picks the target via resolveEffect.
      const pending = engine.getPendingChoice();
      if (pending) {
        const p2 = engine.asPlayer(PLAYER_TWO);
        expectSuccess(p2.resolveEffect({ targets: [enemyId] }));
      }

      const allApMods = engine
        .getG()
        .continuousEffects.filter(
          (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
        );
      const enemyApMods = allApMods.filter((e) => e.targetId === enemyId);
      expect(enemyApMods.length).toBe(1);
      expect(enemyApMods[0]!.payload).toEqual({
        kind: "stat-modifier",
        stat: "ap",
        modifier: -3,
      });
      // Only the chosen enemy unit receives the AP reduction.
      expect(allApMods.length).toBe(1);
    });
  });
});
