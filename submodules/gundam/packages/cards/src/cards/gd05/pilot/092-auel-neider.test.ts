import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05AuelNeider092 } from "./092-auel-neider.ts";

describe("Auel Neider (GD05-092)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05AuelNeider092);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05AuelNeider092],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05AuelNeider092, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  describe("【During Link】【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.", () => {
    it("buffs the linked attacking Unit rather than an enemy Unit", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Auel Neider]" });
      const enemyShield = createMockUnit({ name: "Enemy Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AuelNeider092],
          play: [host],
          resourceArea: activeResources(3),
        },
        { shieldArea: [enemyShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd05AuelNeider092, hostId));
      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(4);
      expectSuccess(p1.enterBattle(hostId, "direct"));

      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(6);
    });

    it("does not apply the attack bonus while the paired Unit is not linked", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Other Pilot]" });
      const enemyShield = createMockUnit({ name: "Enemy Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AuelNeider092],
          play: [host],
          resourceArea: activeResources(3),
        },
        { shieldArea: [enemyShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd05AuelNeider092, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));

      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(4);
    });

    it("does not apply the attack bonus when the linked Unit attacks another Unit", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Auel Neider]" });
      const enemy = createMockUnit({ ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AuelNeider092],
          play: [host],
          resourceArea: activeResources(3),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd05AuelNeider092, hostId));
      expectSuccess(p1.enterBattle(hostId, enemyId));

      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(4);
    });
  });
});
