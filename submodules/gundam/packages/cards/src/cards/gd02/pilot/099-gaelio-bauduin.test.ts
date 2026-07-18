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
import { gd02GaelioBauduin099 } from "./099-gaelio-bauduin.ts";

function gjallarhornTrash(count: number) {
  return Array.from({ length: count }, (_, index) =>
    createMockCommand({ name: `Gjallarhorn Card ${index + 1}`, traits: ["gjallarhorn"] }),
  );
}

describe("Gaelio Bauduin (GD02-099)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02GaelioBauduin099] },
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
      throw new Error("Expected Gaelio Bauduin's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02GaelioBauduin099)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("gives the chosen enemy AP-2 with four Gjallarhorn cards in trash", () => {
    const host = createMockUnit({ name: "Gaelio Host" });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GaelioBauduin099],
        play: [host],
        trash: gjallarhornTrash(4),
        resourceArea: activeResources(3),
        deck: 3,
      },
      { play: [enemy], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02GaelioBauduin099, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Gaelio to ask which enemy Unit loses AP");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });

  it("does not trigger with only three Gjallarhorn cards in trash", () => {
    const host = createMockUnit({ name: "Gaelio Host" });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GaelioBauduin099],
        play: [host],
        trash: gjallarhornTrash(3),
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02GaelioBauduin099, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });

  it("requires both its printed Lv.3 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GaelioBauduin099],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      lowP1.assignPilot(gd02GaelioBauduin099, lowHostId),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02GaelioBauduin099)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GaelioBauduin099],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02GaelioBauduin099, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GaelioBauduin099)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
