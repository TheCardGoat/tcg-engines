import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd04IndiscriminateViolence106 } from "./106-indiscriminate-violence.ts";
import { gd04DestinedBattle107 } from "./107-destined-battle.ts";

describe("Destined Battle (GD04-107)", () => {
  it("【Burst】offers activation and adds this Shield to hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04DestinedBattle107] },
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
    expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getCardZone(shieldId)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("【Action】All enemy Units must choose the chosen rested Unit as their attack target.", () => {
    function setup({ chosenRested = true, canPay = true } = {}) {
      const chosenTarget = createMockUnit({ name: "Chosen Target", hp: 6 });
      const otherTarget = createMockUnit({ name: "Other Target", hp: 6 });
      const firstAttacker = createMockUnit({ name: "First Enemy", ap: 3, hp: 6 });
      const secondAttacker = createMockUnit({ name: "Second Enemy", ap: 3, hp: 6 });
      const shield = createMockUnit({ name: "Setup Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DestinedBattle107],
          play: [
            { card: chosenTarget, exhausted: chosenRested },
            { card: otherTarget, exhausted: true },
          ],
          shieldArea: [shield],
          resourceArea: canPay ? activeResources(2) : restedResources(2),
        },
        { play: [firstAttacker, secondAttacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [chosenTargetId, otherTargetId] = p1.getCardsInZone("battleArea");
      const [firstAttackerId, secondAttackerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(firstAttackerId!, "direct"));
      expectSuccess(p1.passBlock());

      return {
        p1,
        p2,
        commandId,
        chosenTargetId: chosenTargetId!,
        otherTargetId: otherTargetId!,
        secondAttackerId: secondAttackerId!,
      };
    }

    it("offers only the chosen Unit as the next enemy attack target", () => {
      const { p1, p2, commandId, chosenTargetId, otherTargetId, secondAttackerId } = setup();

      expectSuccess(p1.playCommand(commandId, { targets: [chosenTargetId] }));

      expect(p2.getLegalAttackTargets(secondAttackerId)).toEqual([chosenTargetId]);
      expect(p2.getLegalAttackTargets(secondAttackerId)).not.toContain(otherTargetId);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rejects other targets and allows an attack on the chosen Unit", () => {
      const { p1, p2, commandId, chosenTargetId, otherTargetId, secondAttackerId } = setup();

      expectSuccess(p1.playCommand(commandId, { targets: [chosenTargetId] }));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expectFailure(p2.enterBattle(secondAttackerId, otherTargetId), "INVALID_TARGET");
      expectFailure(p2.enterBattle(secondAttackerId, "direct"), "INVALID_TARGET");
      expectSuccess(p2.enterBattle(secondAttackerId, chosenTargetId));
    });

    it("keeps the required target exclusive when the attacker may also attack an active Unit", () => {
      const chosenTarget = createMockUnit({ name: "Required Rested Target", hp: 6 });
      const permittedActiveTarget = createMockUnit({
        name: "Permitted Active Target",
        ap: 5,
        hp: 6,
      });
      const openingAttacker = createMockUnit({
        name: "Opening Academy Attacker",
        traits: ["academy"],
        ap: 3,
        hp: 6,
      });
      const grantedAttacker = createMockUnit({
        name: "Granted Academy Attacker",
        traits: ["academy"],
        ap: 3,
        hp: 6,
      });
      const shield = createMockUnit({ name: "Setup Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DestinedBattle107],
          play: [{ card: chosenTarget, exhausted: true }, permittedActiveTarget],
          shieldArea: [shield],
          resourceArea: activeResources(2),
        },
        {
          hand: [gd04IndiscriminateViolence106],
          play: [openingAttacker, grantedAttacker],
          resourceArea: activeResources(5),
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const destinedBattleId = p1.getHand()[0]!;
      const indiscriminateViolenceId = p2.getHand()[0]!;
      const [chosenTargetId, permittedActiveTargetId] = p1.getCardsInZone("battleArea");
      const [openingAttackerId, grantedAttackerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.playCommand(indiscriminateViolenceId, { targets: [grantedAttackerId!] }));
      expect(p2.getLegalAttackTargets(grantedAttackerId!)).toContain(permittedActiveTargetId);

      expectSuccess(p2.enterBattle(openingAttackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(destinedBattleId, { targets: [chosenTargetId!] }));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getLegalAttackTargets(grantedAttackerId!)).toEqual([chosenTargetId]);
      expectFailure(p2.enterBattle(grantedAttackerId!, permittedActiveTargetId!), "INVALID_TARGET");
      expectFailure(p2.enterBattle(grantedAttackerId!, "direct"), "INVALID_TARGET");
      expectSuccess(p2.enterBattle(grantedAttackerId!, chosenTargetId!));
    });

    it("cannot choose an active friendly Unit", () => {
      const { p1, commandId, chosenTargetId } = setup({ chosenRested: false });

      expectFailure(p1.playCommand(commandId, { targets: [chosenTargetId] }), "INVALID_TARGET");
    });

    it("cannot be played without enough active Resources", () => {
      const { p1, commandId, chosenTargetId } = setup({ canPay: false });

      expectFailure(
        p1.playCommand(commandId, { targets: [chosenTargetId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });

    it("cannot be played during the Main Phase", () => {
      const target = createMockUnit({ name: "Rested Target" });
      const engine = GundamTestEngine.create({
        hand: [gd04DestinedBattle107],
        play: [{ card: target, exhausted: true }],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(gd04DestinedBattle107, { targets: [targetId] }), "WRONG_TIMING");
    });
  });
});
