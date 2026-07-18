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
import { gd02ShagiaFrost092 } from "./092-shagia-frost.ts";

function reachShagiaAttack(linkCondition: string) {
  const host = createMockUnit({
    name: "Shagia Host",
    ap: 2,
    hp: 5,
    traits: ["new une"],
    linkCondition,
  });
  const enemy = createMockUnit({ name: "Prior-turn Attacker", ap: 1, hp: 6 });
  const openingShield = createMockUnit({ name: "Opening Shield" });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02ShagiaFrost092],
      play: [host],
      shieldArea: [openingShield],
      resourceArea: activeResources(4),
      deck: 5,
    },
    { play: [enemy] },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const hostId = p1.getCardsInZone("battleArea")[0]!;
  const enemyId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.enterBattle(enemyId, "direct"));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  expectSuccess(p1.assignPilot(gd02ShagiaFrost092, hostId));
  expectSuccess(p1.enterBattle(hostId, enemyId));

  return { p1, hostId };
}

describe("Shagia Frost (GD02-092)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02ShagiaFrost092] },
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
      throw new Error("Expected Shagia Frost's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02ShagiaFrost092)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("gives the chosen New UNE Unit AP+2 when the linked Unit attacks", () => {
    const { p1, hostId } = reachShagiaAttack("[Shagia Frost]");

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Shagia Frost to ask which New UNE Unit gets AP");
    }
    expect(choice.legalTargetIds).toEqual([hostId]);
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(5);
  });

  it("does not trigger when the paired Unit is not linked", () => {
    const { p1, hostId } = reachShagiaAttack("[Garrod Ran]");

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3);
  });

  it("requires both its printed Lv.4 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02ShagiaFrost092],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02ShagiaFrost092, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02ShagiaFrost092)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02ShagiaFrost092],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02ShagiaFrost092, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02ShagiaFrost092)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
