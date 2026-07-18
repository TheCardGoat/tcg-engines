import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02MomentaryRespite112 } from "./112-momentary-respite.ts";

describe("Momentary Respite (GD02-112)", () => {
  it("【Burst】 draws one card and moves the revealed Command to trash", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02MomentaryRespite112], deck: 3 },
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
      throw new Error("Expected Momentary Respite's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(2);
    expect(p2.getCardZone(gd02MomentaryRespite112)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Main】 adds the chosen purple Pilot from trash to hand", () => {
    const purplePilot = createMockPilot({ color: "purple" });
    const greenPilot = createMockPilot({ color: "green" });
    const purpleUnit = createMockUnit({ color: "purple" });
    const engine = GundamTestEngine.create({
      hand: [gd02MomentaryRespite112],
      trash: [purplePilot, greenPilot, purpleUnit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [purplePilotId, greenPilotId, purpleUnitId] = p1.getCardsInZone("trash");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible purple Pilot choice");
    }
    expect(choice.legalTargetIds).toEqual([purplePilotId]);
    expect(choice.legalTargetIds).not.toEqual(expect.arrayContaining([greenPilotId, purpleUnitId]));
    expectSuccess(p1.resolveEffect({ targets: [purplePilotId!] }));

    expect(p1.getCardZone(purplePilotId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played without a purple Pilot in trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02MomentaryRespite112],
      trash: [createMockPilot({ color: "green" })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd02MomentaryRespite112), "NO_LEGAL_TARGETS");
  });

  it("cannot activate its Main effect during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02MomentaryRespite112],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02MomentaryRespite112), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.4 and active Resource cost 3", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02MomentaryRespite112],
      resourceArea: activeResources(3),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02MomentaryRespite112),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02MomentaryRespite112)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02MomentaryRespite112],
      trash: [createMockPilot({ color: "purple" })],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02MomentaryRespite112), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02MomentaryRespite112)).toBe(`hand:${PLAYER_ONE}`);
  });
});
