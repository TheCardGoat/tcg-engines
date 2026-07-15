import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04RosamiaBadam082 } from "./082-rosamia-badam.ts";

describe("Rosamia Badam (GD04-082)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04RosamiaBadam082] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【When Linked】Choose 1 rested Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to the chosen rested Unit when Rosamia creates a Link Unit", () => {
      const host = createMockUnit({ linkCondition: "[Rosamia Badam]" });
      const target = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd04RosamiaBadam082], play: [host], resourceArea: activeResources(4) },
        { play: [{ card: target, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04RosamiaBadam082, hostId));
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));

      expect(p2.getDamage(targetId)).toBe(1);
    });

    it("does not deal damage when the paired Unit's link condition is not satisfied", () => {
      const host = createMockUnit({ linkCondition: "[Different Pilot]" });
      const target = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd04RosamiaBadam082], play: [host], resourceArea: activeResources(4) },
        { play: [{ card: target, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04RosamiaBadam082, host));

      expect(p2.getDamage(targetId)).toBe(0);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
