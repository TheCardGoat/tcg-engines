import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
  hasForceAttackTarget,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04DestinedBattle107 } from "./107-destined-battle.ts";

describe("Destined Battle (GD04-107)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04DestinedBattle107] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  describe("【Action】Choose 1 of your rested Units. During this turn, all enemy Units must choose that Unit as their attack target when attacking.", () => {
    function setup() {
      const chosenTarget = createMockUnit({ name: "Chosen Target", hp: 6 });
      const otherTarget = createMockUnit({ name: "Other Target", hp: 6 });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 6 });
      const secondAttacker = createMockUnit({ name: "Second Enemy", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DestinedBattle107],
          play: [
            { card: chosenTarget, exhausted: true },
            { card: otherTarget, exhausted: true },
          ],
          resourceArea: activeResources(2),
        },
        { play: [attacker, secondAttacker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [chosenTargetId, otherTargetId] = p1.getCardsInZone("battleArea");
      const [attackerId, secondAttackerId] = p2.getCardsInZone("battleArea");

      engine.setPhase("end-phase");
      engine.setStep("action-step");

      return {
        engine,
        p1,
        p2,
        chosenTargetId: chosenTargetId!,
        otherTargetId: otherTargetId!,
        attackerId: attackerId!,
        secondAttackerId: secondAttackerId!,
      };
    }

    it("forces every current enemy Unit to attack the chosen rested Unit", () => {
      const { engine, p1, chosenTargetId, attackerId, secondAttackerId } = setup();

      expectSuccess(p1.playCommand(gd04DestinedBattle107, { targets: [chosenTargetId] }));

      expect(hasForceAttackTarget(engine, attackerId)).toBe(true);
      expect(hasForceAttackTarget(engine, secondAttackerId)).toBe(true);
    });

    it("prevents an affected enemy Unit from attacking a different rested Unit", () => {
      const { engine, p1, p2, chosenTargetId, otherTargetId, attackerId } = setup();

      expectSuccess(p1.playCommand(gd04DestinedBattle107, { targets: [chosenTargetId] }));
      engine.setPhase("main-phase");

      expectFailure(p2.enterBattle(attackerId, otherTargetId), "INVALID_TARGET");
    });

    it("prevents an affected enemy Unit from attacking directly", () => {
      const { engine, p1, p2, chosenTargetId, attackerId } = setup();

      expectSuccess(p1.playCommand(gd04DestinedBattle107, { targets: [chosenTargetId] }));
      engine.setPhase("main-phase");

      expectFailure(p2.enterBattle(attackerId, "direct"), "INVALID_TARGET");
    });

    it("allows an affected enemy Unit to attack the chosen rested Unit", () => {
      const { engine, p1, p2, chosenTargetId, attackerId } = setup();

      expectSuccess(p1.playCommand(gd04DestinedBattle107, { targets: [chosenTargetId] }));
      engine.setPhase("main-phase");

      expectSuccess(p2.enterBattle(attackerId, chosenTargetId));
    });

    it("moves the command card to trash after resolution", () => {
      const { engine, p1, chosenTargetId } = setup();
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd04DestinedBattle107, { targets: [chosenTargetId] }));

      expectCardInTrash(engine, commandId, PLAYER_ONE);
    });

    it("cannot choose an active friendly Unit", () => {
      const activeTarget = createMockUnit({ name: "Active Target", hp: 6 });
      const enemy = createMockUnit({ name: "Enemy", hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DestinedBattle107],
          play: [activeTarget],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const activeTargetId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd04DestinedBattle107, { targets: [activeTargetId] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played outside Action timing", () => {
      const { engine, p1, chosenTargetId } = setup();
      engine.setPhase("main-phase");

      expectFailure(
        p1.playCommand(gd04DestinedBattle107, { targets: [chosenTargetId] }),
        "WRONG_TIMING",
      );
    });

    it("cannot be played without enough active resources", () => {
      const { engine, p1, chosenTargetId } = setup();
      for (const resourceId of p1.getCardsInZone("resourceArea")) {
        engine.getG().exhausted[resourceId] = true;
      }

      expectFailure(
        p1.playCommand(gd04DestinedBattle107, { targets: [chosenTargetId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
