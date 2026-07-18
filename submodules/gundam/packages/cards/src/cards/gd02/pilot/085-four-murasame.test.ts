import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02DramaticTurnabout100 } from "../command/100-dramatic-turnabout.ts";
import { gd02FourMurasame085 } from "./085-four-murasame.ts";

type TestPlayer = ReturnType<GundamTestEngine["asPlayer"]>;

function damageCommand(name: string) {
  return createMockCommand({
    name,
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 2,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 friendly Unit. Deal 2 damage to it.",
      },
    ],
  });
}

function healingCommandForOpponent() {
  return createMockCommand({
    name: "Opponent's Recovery",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "recoverHP",
              amount: 2,
              target: {
                owner: "opponent",
                cardType: "unit",
                state: "damaged",
                count: 1,
              },
            },
          },
        ],
        sourceText: "【Main】Choose 1 damaged enemy Unit. It recovers 2 HP.",
      },
    ],
  });
}

function resolveDamageCommand(p1: TestPlayer, commandId: string, targetId: string): void {
  expectSuccess(p1.playCommand(commandId));
  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "targetSelection") {
    throw new Error("Expected a visible friendly Unit damage choice");
  }
  expect(choice.legalTargetIds).toContain(targetId);
  expectSuccess(p1.resolveEffect({ targets: [targetId] }));
}

function resolveDramaticTurnabout(p1: TestPlayer, commandId: string, targetId: string): void {
  expectSuccess(p1.playCommand(commandId));
  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "targetSelection") {
    throw new Error("Expected Dramatic Turnabout to ask which damaged Unit recovers");
  }
  expect(choice.legalTargetIds).toContain(targetId);
  expectSuccess(p1.resolveEffect({ targets: [targetId] }));
}

describe("Four Murasame (GD02-085)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02FourMurasame085] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Four Murasame's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02FourMurasame085)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("draws once when its linked Unit legally recovers HP during its controller's turn", () => {
    const host = createMockUnit({ name: "Four's Host", hp: 7, linkCondition: "[Four Murasame]" });
    const damage = damageCommand("Friendly Damage");
    const engine = GundamTestEngine.create({
      hand: [gd02FourMurasame085, damage, gd02DramaticTurnabout100],
      play: [host],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const damageId = p1.getHand()[1]!;
    const recoveryId = p1.getHand()[2]!;

    expectSuccess(p1.assignPilot(gd02FourMurasame085, hostId));
    resolveDamageCommand(p1, damageId, hostId);
    expect(p1.getDamage(hostId)).toBe(2);
    resolveDramaticTurnabout(p1, recoveryId, hostId);

    expect(p1.getDamage(hostId)).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getPilotId(hostId)).toBeDefined();
  });

  it("does not draw when a different friendly Unit recovers HP", () => {
    const host = createMockUnit({ name: "Four's Host", hp: 7, linkCondition: "[Four Murasame]" });
    const otherUnit = createMockUnit({ name: "Other Friendly Unit", hp: 7 });
    const damage = damageCommand("Damage Other Unit");
    const engine = GundamTestEngine.create({
      hand: [gd02FourMurasame085, damage, gd02DramaticTurnabout100],
      play: [host, otherUnit],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, otherUnitId] = p1.getCardsInZone("battleArea");
    const damageId = p1.getHand()[1]!;
    const recoveryId = p1.getHand()[2]!;

    expectSuccess(p1.assignPilot(gd02FourMurasame085, hostId!));
    resolveDamageCommand(p1, damageId, otherUnitId!);
    resolveDramaticTurnabout(p1, recoveryId, otherUnitId!);

    expect(p1.getDamage(otherUnitId!)).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
  });

  it("does not draw when the linked Unit recovers during the opponent's turn", () => {
    const host = createMockUnit({ name: "Four's Host", hp: 7, linkCondition: "[Four Murasame]" });
    const damage = damageCommand("Damage Before Opponent Turn");
    const opponentHealing = healingCommandForOpponent();
    const engine = GundamTestEngine.create(
      {
        hand: [gd02FourMurasame085, damage],
        play: [host],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { hand: [opponentHealing], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const damageId = p1.getHand()[1]!;
    const healingId = p2.getHand()[0]!;

    expectSuccess(p1.assignPilot(gd02FourMurasame085, hostId));
    resolveDamageCommand(p1, damageId, hostId);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.playCommand(healingId));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the opponent to choose the visibly damaged linked Unit");
    }
    expect(choice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p2.resolveEffect({ targets: [hostId] }));

    expect(p1.getDamage(hostId)).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
  });

  it("does not draw with five cards in hand when the linked Unit recovers HP", () => {
    const host = createMockUnit({ name: "Four's Host", hp: 7, linkCondition: "[Four Murasame]" });
    const damage = damageCommand("Damage With Full Hand");
    const fillers = Array.from({ length: 5 }, (_, index) =>
      createMockCommand({ name: `Card Kept in Hand ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd02FourMurasame085, damage, gd02DramaticTurnabout100, ...fillers],
      play: [host],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const damageId = p1.getHand()[1]!;
    const recoveryId = p1.getHand()[2]!;

    expectSuccess(p1.assignPilot(gd02FourMurasame085, hostId));
    resolveDamageCommand(p1, damageId, hostId);
    expect(p1.getHand()).toHaveLength(6);
    resolveDramaticTurnabout(p1, recoveryId, hostId);

    expect(p1.getHand()).toHaveLength(6);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
  });

  it("draws only once when its linked Unit recovers HP twice in one turn", () => {
    const host = createMockUnit({ name: "Four's Host", hp: 7, linkCondition: "[Four Murasame]" });
    const firstDamage = damageCommand("First Damage");
    const secondDamage = damageCommand("Second Damage");
    const engine = GundamTestEngine.create({
      hand: [
        gd02FourMurasame085,
        firstDamage,
        gd02DramaticTurnabout100,
        secondDamage,
        gd02DramaticTurnabout100,
      ],
      play: [host],
      resourceArea: activeResources(8),
      deck: 8,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const firstDamageId = p1.getHand()[1]!;
    const firstRecoveryId = p1.getHand()[2]!;
    const secondDamageId = p1.getHand()[3]!;
    const secondRecoveryId = p1.getHand()[4]!;

    expectSuccess(p1.assignPilot(gd02FourMurasame085, hostId));
    resolveDamageCommand(p1, firstDamageId, hostId);
    resolveDramaticTurnabout(p1, firstRecoveryId, hostId);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(6);
    resolveDamageCommand(p1, secondDamageId, hostId);
    resolveDramaticTurnabout(p1, secondRecoveryId, hostId);

    expect(p1.getDamage(hostId)).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
  });

  it("does not draw for HP recovery while the Pilot is not linked", () => {
    const host = createMockUnit({ name: "Unlinked Host", hp: 7, linkCondition: "[Kamille Bidan]" });
    const damage = damageCommand("Unlinked Damage");
    const engine = GundamTestEngine.create({
      hand: [gd02FourMurasame085, damage, gd02DramaticTurnabout100],
      play: [host],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const damageId = p1.getHand()[1]!;
    const recoveryId = p1.getHand()[2]!;

    expectSuccess(p1.assignPilot(gd02FourMurasame085, hostId));
    resolveDamageCommand(p1, damageId, hostId);
    resolveDramaticTurnabout(p1, recoveryId, hostId);

    expect(p1.getDamage(hostId)).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
  });

  it("requires both its printed Lv.5 and one active Resource to be paired", () => {
    const lowLevelHost = createMockUnit({ name: "Low-Level Host" });
    const lowLevel = GundamTestEngine.create({
      hand: [gd02FourMurasame085],
      play: [lowLevelHost],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02FourMurasame085, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02FourMurasame085)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const costHost = createMockUnit({ name: "Cost-Gate Host" });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02FourMurasame085],
      play: [costHost],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const setupId = p1.getHand()[0]!;
    const pilotId = p1.getHand()[1]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setupId));
    expectFailure(p1.assignPilot(pilotId, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
