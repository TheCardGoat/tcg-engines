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
import { gd02BeneathTheMask101 } from "./101-beneath-the-mask.ts";

describe("Beneath the Mask (GD02-101)", () => {
  it("【Main】 asks for one or two eligible enemy Units and rests both chosen Units", () => {
    const friendly = createMockUnit({ level: 2 });
    const firstEnemy = createMockUnit({ level: 2 });
    const secondEnemy = createMockUnit({ level: 1 });
    const tooHigh = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02BeneathTheMask101],
        play: [friendly],
        resourceArea: activeResources(1),
      },
      { play: [firstEnemy, secondEnemy, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId, tooHighId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible enemy Unit selection");
    }
    expect(choice).toMatchObject({ minTargets: 1, maxTargets: 2 });
    expect(choice.legalTargetIds).toEqual([firstEnemyId, secondEnemyId]);
    expect(choice.legalTargetIds).not.toEqual(expect.arrayContaining([friendlyId, tooHighId]));
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!, secondEnemyId!] }));

    expect(p2.isExhausted(firstEnemyId!)).toBe(true);
    expect(p2.isExhausted(secondEnemyId!)).toBe(true);
    expect(p2.isExhausted(tooHighId!)).toBe(false);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can rest one eligible enemy Unit during a legally reached Action step", () => {
    const enemy = createMockUnit({ level: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd02BeneathTheMask101], resourceArea: activeResources(1) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02BeneathTheMask101));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected an Action-step enemy Unit selection");
    }
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
  });

  it("cannot be played when every enemy Unit is above Lv.2", () => {
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd02BeneathTheMask101], resourceArea: activeResources(1) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd02BeneathTheMask101), "NO_LEGAL_TARGETS");
  });

  it("enforces both its printed Lv.1 and active Resource cost 1", () => {
    const lowLevel = GundamTestEngine.create({ hand: [gd02BeneathTheMask101] });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02BeneathTheMask101),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02BeneathTheMask101)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 1,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const enemy = createMockUnit({ level: 2 });
    const insufficient = GundamTestEngine.create(
      { hand: [setup, gd02BeneathTheMask101], resourceArea: activeResources(1) },
      { play: [enemy] },
    );
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02BeneathTheMask101), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02BeneathTheMask101)).toBe(`hand:${PLAYER_ONE}`);
  });
});
