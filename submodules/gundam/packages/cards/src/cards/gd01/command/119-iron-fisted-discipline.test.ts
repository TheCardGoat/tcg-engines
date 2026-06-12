import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockResource,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { gd01IronFistedDiscipline119 } from "./119-iron-fisted-discipline.ts";

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

function findApModifier(
  effects: Array<{ targetId: string; payload: { kind: string; stat?: string; modifier?: number } }>,
  targetId: string,
): { stat: string; modifier: number } | undefined {
  const entry = effects.find(
    (e) => e.targetId === targetId && e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
  );
  if (!entry) return undefined;
  return { stat: entry.payload.stat!, modifier: entry.payload.modifier! };
}

describe("Iron-Fisted Discipline (GD01-119)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this turn.", () => {
    it("applies AP-2 modifier to an enemy Lv.4 unit during main-phase", () => {
      const enemyUnit = createMockUnit({ level: 4, ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd01IronFistedDiscipline119], resourceArea: resources(3) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01IronFistedDiscipline119, { targets: [unitId!] }));
      const mod = findApModifier(
        engine.getG().continuousEffects as Array<{
          targetId: string;
          payload: { kind: string; stat?: string; modifier?: number };
        }>,
        unitId!,
      );
      expect(mod).toBeDefined();
      expect(mod!.stat).toBe("ap");
      expect(mod!.modifier).toBe(-2);
    });

    it("applies AP-2 modifier to an enemy Lv.2 unit during action-phase", () => {
      const enemyUnit = createMockUnit({ level: 2, ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd01IronFistedDiscipline119], resourceArea: resources(3) },
        { play: [enemyUnit] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01IronFistedDiscipline119, { targets: [unitId!] }));
      const mod = findApModifier(
        engine.getG().continuousEffects as Array<{
          targetId: string;
          payload: { kind: string; stat?: string; modifier?: number };
        }>,
        unitId!,
      );
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(-2);
    });

    it("cannot target an enemy unit above Lv.4", () => {
      const enemyUnit = createMockUnit({ level: 5, ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd01IronFistedDiscipline119], resourceArea: resources(3) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01IronFistedDiscipline119, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });

    it("moves the command card to trash after resolution", () => {
      const enemyUnit = createMockUnit({ level: 3, ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd01IronFistedDiscipline119], resourceArea: resources(3) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01IronFistedDiscipline119, { targets: [unitId!] }));
      const zoneKey = engine.getState().ctx.zones.private.cardIndex[cmdId]?.zoneKey;
      expect(zoneKey).toBe(`trash:${p1.playerId}`);
    });
  });
});
