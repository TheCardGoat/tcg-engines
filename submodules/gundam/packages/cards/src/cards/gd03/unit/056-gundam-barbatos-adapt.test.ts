import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectFailure,
  expectLogType,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { gd03GundamBarbatosAdapt056 } from "./056-gundam-barbatos-adapt.ts";

describe("Gundam Barbatos Adapt (GD03-056)", () => {
  describe("【Deploy】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.", () => {
    it("deals 1 damage to the chosen friendly Unit and the chosen enemy Unit", () => {
      const ally = createMockUnit({ hp: 4 });
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03GundamBarbatosAdapt056],
          play: [ally],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      const deployed = p1.must.deployUnit(gd03GundamBarbatosAdapt056);
      expectPublicLog(engine, "gundam.move.deployUnit", {
        playerId: PLAYER_ONE,
        cost: gd03GundamBarbatosAdapt056.cost,
      });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        minTargets: 2,
        maxTargets: 2,
        groups: [
          {
            minTargets: 1,
            maxTargets: 1,
            legalTargetIds: expect.arrayContaining([p1.unit(ally).instanceId, deployed.instanceId]),
          },
          { minTargets: 1, maxTargets: 1, legalTargetIds: [p2.unit(enemy).instanceId] },
        ],
      });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
      expect(choice.groups[0]?.legalTargetIds).not.toContain(p2.unit(enemy).instanceId);
      expect(choice.groups[1]?.legalTargetIds).not.toContain(p1.unit(ally).instanceId);
      expect(choice.groups[1]?.legalTargetIds).not.toContain(deployed.instanceId);
      p1.must.resolveEffect({ targets: [ally, enemy] });

      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p1, ally).toHaveDamage(1);
      expectCard(p1, gd03GundamBarbatosAdapt056).toHaveDamage(0);
      expectCard(p2, enemy).toHaveDamage(1);
    });

    it("may choose itself as the friendly damage target", () => {
      const ally = createMockUnit({ hp: 4 });
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03GundamBarbatosAdapt056],
          play: [ally],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      const deployed = p1.must.deployUnit(gd03GundamBarbatosAdapt056);
      p1.must.resolveEffect({ targets: [deployed, enemy] });

      expectCard(p1, gd03GundamBarbatosAdapt056).toHaveDamage(1);
      expectCard(p1, ally).toHaveDamage(0);
      expectCard(p2, enemy).toHaveDamage(1);
    });

    it("does not deal damage when no enemy Unit is in play", () => {
      const ally = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd03GundamBarbatosAdapt056],
        play: [ally],
        resourceArea: activeResources(4),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.deployUnit(gd03GundamBarbatosAdapt056);

      // No legal enemy target: deploy still succeeds, but no damage is applied
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p1, ally).toHaveDamage(0);
      expectCard(p1, gd03GundamBarbatosAdapt056).toHaveDamage(0);
    });
  });

  it("cannot deploy below Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03GundamBarbatosAdapt056],
      resourceArea: activeResources(2),
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd03GundamBarbatosAdapt056),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });
});
