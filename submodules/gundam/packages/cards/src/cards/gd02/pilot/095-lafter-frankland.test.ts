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
import { gd01StrategicArms108 } from "../../gd01/command/108-strategic-arms.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02LafterFrankland095 } from "./095-lafter-frankland.ts";

function attackWithDamagedHost(level: number) {
  const host = createMockUnit({
    name: "Lafter Host",
    level,
    ap: 2,
    hp: 6,
    keywordEffects: [{ keyword: "Blocker" }],
  });
  const enemy = createMockUnit({ name: "Prior-turn Attacker", ap: 1, hp: 6 });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02LafterFrankland095, gd01StrategicArms108],
      play: [host],
      shieldArea: [createMockUnit({ name: "Opening Shield" })],
      resourceArea: activeResources(8),
      deck: 4,
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
  expectSuccess(p1.assignPilot(gd02LafterFrankland095, hostId));
  expectSuccess(p1.playCommand(gd01StrategicArms108));
  expect(p1.getDamage(hostId)).toBe(2);
  expectSuccess(p1.enterBattle(hostId, enemyId));

  return { p1, hostId };
}

describe("Lafter Frankland (GD02-095)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02LafterFrankland095] },
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
      throw new Error("Expected Lafter Frankland's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02LafterFrankland095)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("grants High-Maneuver during battle to its damaged Lv.5-or-lower Unit", () => {
    const { p1, hostId } = attackWithDamagedHost(5);

    expect(p1.getVisibleCard(hostId)?.keywords).toContain("HighManeuver");
  });

  it("does not grant High-Maneuver to a damaged Lv.6 Unit", () => {
    const { p1, hostId } = attackWithDamagedHost(6);

    expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("HighManeuver");
  });

  it("requires both its printed Lv.4 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02LafterFrankland095],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      lowP1.assignPilot(gd02LafterFrankland095, lowHostId),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02LafterFrankland095)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd02LafterFrankland095],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02LafterFrankland095, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02LafterFrankland095)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
