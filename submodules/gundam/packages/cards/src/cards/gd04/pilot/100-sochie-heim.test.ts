import { describe, it, expect } from "vite-plus/test";
import type { UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04SochieHeim100 } from "./100-sochie-heim.ts";

function costedEffectUnit(cost: number): UnitCard {
  return createMockUnit({
    ap: 2,
    hp: 4,
    effects: [
      {
        type: "activated",
        activation: { timing: ["activate:main"] },
        cost: { payResources: cost },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: `【Activate･Main】${cost}：Draw 1.`,
      },
    ],
  });
}

describe("Sochie Heim (GD04-100)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04SochieHeim100] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
  });

  describe("【Once per Turn】When you pay ① or more cost for one of your Units' effects, you may increase this Unit's AP during this turn by an amount equal to the cost paid.", () => {
    it("increases the paired Unit's AP by the paid Unit effect cost when accepted", () => {
      const host = createMockUnit({ ap: 3, hp: 4 });
      const payer = costedEffectUnit(2);
      const engine = GundamTestEngine.create({
        hand: [gd04SochieHeim100],
        play: [host, payer],
        resourceArea: activeResources(5),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, payerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd04SochieHeim100, hostId!));
      expectSuccess(p1.activateAbility(payerId!, 0));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 5 });
    });

    it("does not increase AP when the optional trigger is declined", () => {
      const host = createMockUnit({ ap: 3, hp: 4 });
      const payer = costedEffectUnit(2);
      const engine = GundamTestEngine.create({
        hand: [gd04SochieHeim100],
        play: [host, payer],
        resourceArea: activeResources(5),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, payerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd04SochieHeim100, hostId!));
      expectSuccess(p1.activateAbility(payerId!, 0));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 3 });
    });

    it("does not trigger more than once per turn", () => {
      const host = createMockUnit({ ap: 3, hp: 4 });
      const firstPayer = costedEffectUnit(2);
      const secondPayer = costedEffectUnit(1);
      const engine = GundamTestEngine.create({
        hand: [gd04SochieHeim100],
        play: [host, firstPayer, secondPayer],
        resourceArea: activeResources(6),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, firstPayerId, secondPayerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd04SochieHeim100, hostId!));
      expectSuccess(p1.activateAbility(firstPayerId!, 0));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
      expectSuccess(p1.activateAbility(secondPayerId!, 0));

      expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 5 });
    });
  });
});
