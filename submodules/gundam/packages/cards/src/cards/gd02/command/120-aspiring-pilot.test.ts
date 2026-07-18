import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02AspiringPilot120 } from "./120-aspiring-pilot.ts";

describe("Aspiring Pilot (GD02-120)", () => {
  it("recovers 2 HP from the chosen damaged AEUG Base", () => {
    const base = createMockBase({ name: "AEUG Base", hp: 5, traits: ["aeug"] });
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02AspiringPilot120],
        baseSection: [base],
        resourceArea: activeResources(3),
        deck: 3,
      },
      { play: [attacker], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getDamage(baseId)).toBe(2);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02AspiringPilot120));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible damaged AEUG Unit/Base choice");
    }
    expect(choice.legalTargetIds).toEqual([baseId]);
    expectSuccess(p1.resolveEffect({ targets: [baseId] }));

    expect(p1.getDamage(baseId)).toBe(0);
    expect(p1.getCardZone(gd02AspiringPilot120)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not offer a non-AEUG Unit as a recovery target", () => {
    const base = createMockBase({ hp: 5, traits: ["aeug"] });
    const nonAeug = createMockUnit({ hp: 5, traits: ["titans"] });
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02AspiringPilot120],
        baseSection: [base],
        play: [nonAeug],
        resourceArea: activeResources(3),
        deck: 3,
      },
      { play: [attacker], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const nonAeugId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02AspiringPilot120));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected an AEUG target choice");
    expect(choice.legalTargetIds).toEqual([baseId]);
    expect(choice.legalTargetIds).not.toContain(nonAeugId);
  });

  it("can be paired as Fa Yuiry instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02AspiringPilot120],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 5 });
  });

  it("cannot activate during Main", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02AspiringPilot120],
      resourceArea: activeResources(3),
    });

    expectFailure(engine.asPlayer(PLAYER_ONE).playCommand(gd02AspiringPilot120), "WRONG_TIMING");
  });

  it("enforces its printed Lv.3 and active Resource cost 1 in a legal Action step", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02AspiringPilot120],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    expectSuccess(lowP1.passPhase());
    expectSuccess(lowLevel.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(lowP1.playCommand(gd02AspiringPilot120), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02AspiringPilot120)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02AspiringPilot120],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectSuccess(p1.passPhase());
    expectSuccess(insufficient.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(p1.playCommand(gd02AspiringPilot120), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02AspiringPilot120)).toBe(`hand:${PLAYER_ONE}`);
  });
});
