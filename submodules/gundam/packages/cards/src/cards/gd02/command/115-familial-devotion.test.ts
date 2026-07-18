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
import { gd02FamilialDevotion115 } from "./115-familial-devotion.ts";

describe("Familial Devotion (GD02-115)", () => {
  it("【Main】 gives the chosen friendly Vulture Unit AP+2 for the turn", () => {
    const vulture = createMockUnit({ ap: 2, traits: ["vulture"] });
    const other = createMockUnit({ ap: 3, traits: ["aeug"] });
    const enemyVulture = createMockUnit({ ap: 4, traits: ["vulture"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02FamilialDevotion115],
        play: [vulture, other],
        resourceArea: activeResources(2),
      },
      { play: [enemyVulture] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [vultureId, otherId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible friendly Vulture Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([vultureId]);
    expect(choice.legalTargetIds).not.toEqual(expect.arrayContaining([otherId, enemyId]));
    expectSuccess(p1.resolveEffect({ targets: [vultureId!] }));

    expect(p1.getVisibleCard(vultureId!)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(otherId!)?.effectiveAp).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can give AP during a legally reached Action step", () => {
    const vulture = createMockUnit({ ap: 2, traits: ["vulture"] });
    const engine = GundamTestEngine.create({
      hand: [gd02FamilialDevotion115],
      play: [vulture],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const vultureId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02FamilialDevotion115));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a Vulture Unit choice");
    expectSuccess(p1.resolveEffect({ targets: [vultureId] }));

    expect(p1.getVisibleCard(vultureId)?.effectiveAp).toBe(4);
  });

  it("cannot be played without a friendly Vulture Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02FamilialDevotion115],
      play: [createMockUnit({ traits: ["aeug"] })],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(gd02FamilialDevotion115),
      "NO_LEGAL_TARGETS",
    );
  });

  it("can be paired as Witz Sou instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02FamilialDevotion115],
      play: [host],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 5 });
  });

  it("enforces its printed Lv.2 and active Resource cost 1", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02FamilialDevotion115],
      resourceArea: activeResources(1),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02FamilialDevotion115),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02FamilialDevotion115)).toBe(
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
      hand: [setup, gd02FamilialDevotion115],
      resourceArea: activeResources(2),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02FamilialDevotion115), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02FamilialDevotion115)).toBe(`hand:${PLAYER_ONE}`);
  });
});
