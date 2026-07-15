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
import { gd01ZeonRemnantForces115 } from "../command/115-zeon-remnant-forces.ts";
import { gd01ElanCeresEnhancedPersonNumber4098 } from "./098-elan-ceres-enhanced-person-number-4.ts";

function passToPlayerTwoMain(
  p1: ReturnType<GundamTestEngine["asPlayer"]>,
  p2: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
}

describe("Elan Ceres (Enhanced Person Number 4) (GD01-098)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01ElanCeresEnhancedPersonNumber4098] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01ElanCeresEnhancedPersonNumber4098)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Activate･Action】 recovers 1 HP when an enemy Unit has 1 or less AP", () => {
    const host = createMockUnit({ ap: 3, hp: 6 });
    const lowApEnemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ElanCeresEnhancedPersonNumber4098],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [gd01ZeonRemnantForces115, gd01ZeonRemnantForces115],
        play: [lowApEnemy],
        resourceArea: activeResources(4),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [firstDamageCommandId, secondDamageCommandId] = p2.getHand();

    expectSuccess(p1.assignPilot(gd01ElanCeresEnhancedPersonNumber4098, hostId));
    const pilotId = p1.getPilotId(hostId)!;
    passToPlayerTwoMain(p1, p2);
    expectSuccess(p2.playCommand(firstDamageCommandId!));
    const damageChoice = p2.getBoardView().pendingChoice;
    if (damageChoice?.kind !== "targetSelection") {
      throw new Error("Expected Zeon Remnant Forces to ask which enemy Unit receives damage");
    }
    expect(damageChoice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p2.resolveEffect({ targets: [hostId] }));
    expect(p1.getDamage(hostId)).toBe(1);
    expectSuccess(p2.passPhase());
    expectSuccess(p1.activateAbility(pilotId, 0));

    expect(p1.getDamage(hostId)).toBe(0);

    expectSuccess(p2.playCommand(secondDamageCommandId!));
    const secondDamageChoice = p2.getBoardView().pendingChoice;
    if (secondDamageChoice?.kind !== "targetSelection") {
      throw new Error("Expected the second damage Command to ask which enemy Unit receives damage");
    }
    expect(secondDamageChoice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p2.resolveEffect({ targets: [hostId] }));
    expect(p1.getDamage(hostId)).toBe(1);

    expectFailure(p1.activateAbility(pilotId, 0), "ABILITY_LIMIT_REACHED");
    expect(p1.getDamage(hostId)).toBe(1);
  });

  it("cannot activate when every enemy Unit has more than 1 AP", () => {
    const host = createMockUnit({ ap: 3, hp: 6 });
    const enemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ElanCeresEnhancedPersonNumber4098],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [gd01ZeonRemnantForces115],
        play: [enemy],
        resourceArea: activeResources(4),
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01ElanCeresEnhancedPersonNumber4098, hostId));
    const pilotId = p1.getPilotId(hostId)!;
    passToPlayerTwoMain(p1, p2);
    expectSuccess(p2.playCommand(gd01ZeonRemnantForces115));
    const damageChoice = p2.getBoardView().pendingChoice;
    if (damageChoice?.kind !== "targetSelection") {
      throw new Error("Expected Zeon Remnant Forces to ask which enemy Unit receives damage");
    }
    expect(damageChoice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p2.resolveEffect({ targets: [hostId] }));
    expectSuccess(p2.passPhase());

    expectFailure(p1.activateAbility(pilotId, 0), "CONDITIONS_NOT_MET");
    expect(p1.getDamage(hostId)).toBe(1);
  });
});
