import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04NenaTrinity089 } from "./089-nena-trinity.ts";

describe("Nena Trinity (GD04-089)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04NenaTrinity089] },
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

  describe("【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)", () => {
    it("rests the paired Unit and increases another friendly Unit's battle damage by 2", () => {
      const host = createMockUnit({ name: "Nena Host", ap: 2 });
      const target = createMockUnit({ name: "Supported Unit", ap: 3, hp: 5 });
      const defender = createMockUnit({ name: "Enemy Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04NenaTrinity089],
          play: [host, target],
          resourceArea: activeResources(4),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, targetId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04NenaTrinity089, hostId!));
      expectSuccess(p1.useSupport(hostId!, targetId!));
      expectSuccess(p1.enterBattle(targetId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.isExhausted(hostId!)).toBe(true);
      expect(p2.getDamage(defenderId)).toBe(5);
    });

    it("cannot target the Unit with Support itself", () => {
      const host = createMockUnit({ ap: 2 });
      const engine = GundamTestEngine.create({
        hand: [gd04NenaTrinity089],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04NenaTrinity089, hostId));

      expectFailure(p1.useSupport(hostId, hostId), "ILLEGAL_TARGET");
    });
  });
});
