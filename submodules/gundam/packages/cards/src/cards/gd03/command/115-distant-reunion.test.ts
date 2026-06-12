import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03DistantReunion115 } from "./115-distant-reunion.ts";

describe("Distant Reunion (GD03-115)", () => {
  describe("【Action】Choose 1 friendly Unit paired with an (X-Rounder) Pilot. It can't receive battle damage from enemy Units with 2 or less AP during this battle. If you are Lv.7 or higher, it can't receive battle damage from enemy Units with 5 or less AP instead.", () => {
    function setup(attackerAp: number, playerLevel: number) {
      const xRounder = createMockPilot({ traits: ["x-rounder"], cost: 1 });
      const target = createMockUnit({ ap: 1, hp: 7 });
      const attacker = createMockUnit({ ap: attackerAp, hp: 7 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03DistantReunion115, xRounder],
          play: [{ card: target, exhausted: true }],
          resourceArea: activeResources(playerLevel),
        },
        { play: [attacker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(xRounder, targetId));
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
      engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);

      return { engine, p1, p2, targetId, attackerId };
    }

    function resolveAttackAfterCommand(ctx: ReturnType<typeof setup>, commandTargets: string[]) {
      const { p1, p2, attackerId, targetId } = ctx;
      expectSuccess(p2.enterBattle(attackerId, targetId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(gd03DistantReunion115, { targets: commandTargets }));
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
    }

    it("prevents battle damage from an enemy Unit with 2 AP at Lv.6", () => {
      const ctx = setup(2, 6);

      resolveAttackAfterCommand(ctx, [ctx.targetId]);

      expect(ctx.p1.getDamage(ctx.targetId)).toBe(0);
      expect(ctx.p2.getDamage(ctx.attackerId)).toBe(2);
    });

    it("does not prevent battle damage from an enemy Unit with 3 AP below Lv.7", () => {
      const ctx = setup(3, 6);

      resolveAttackAfterCommand(ctx, [ctx.targetId]);

      expect(ctx.p1.getDamage(ctx.targetId)).toBe(3);
      expect(ctx.p2.getDamage(ctx.attackerId)).toBe(2);
    });

    it("prevents battle damage from an enemy Unit with 5 AP at Lv.7", () => {
      const ctx = setup(5, 7);

      resolveAttackAfterCommand(ctx, [ctx.targetId]);

      expect(ctx.p1.getDamage(ctx.targetId)).toBe(0);
      expect(ctx.p2.getDamage(ctx.attackerId)).toBe(2);
    });

    it("cannot target a Unit that is not paired with an X-Rounder Pilot", () => {
      const ordinaryPilot = createMockPilot({ traits: ["earth federation"], cost: 1 });
      const target = createMockUnit({ ap: 1, hp: 7 });
      const attacker = createMockUnit({ ap: 2, hp: 7 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03DistantReunion115, ordinaryPilot],
          play: [{ card: target, exhausted: true }],
          resourceArea: activeResources(6),
        },
        { play: [attacker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(ordinaryPilot, targetId));
      engine.setPhase("end-phase");
      engine.setStep("action-step");

      expectFailure(
        p1.playCommand(gd03DistantReunion115, { targets: [targetId] }),
        "INVALID_TARGET",
      );
      expect(p1.getDamage(targetId)).toBe(0);
      expect(p2.getDamage(attackerId)).toBe(0);
    });
  });
});
