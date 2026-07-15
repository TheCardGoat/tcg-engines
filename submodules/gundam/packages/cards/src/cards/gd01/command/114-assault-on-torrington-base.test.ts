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
import { gd01AssaultOnTorringtonBase114 } from "./114-assault-on-torrington-base.ts";

describe("Assault on Torrington Base (GD01-114)", () => {
  it("【Action】 gives exactly two chosen friendly Units AP+1", () => {
    const first = createMockUnit({ ap: 2 });
    const second = createMockUnit({ ap: 3 });
    const third = createMockUnit({ ap: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd01AssaultOnTorringtonBase114],
      play: [first, second, third],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstId, secondId, thirdId] = p1.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Assault on Torrington Base to ask for exactly two friendly Units");
    }
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining([firstId, secondId, thirdId]));
    expect(choice.minTargets).toBe(2);
    expect(choice.maxTargets).toBe(2);
    expectSuccess(p1.resolveEffect({ targets: [firstId!, secondId!] }));

    expect(p1.getVisibleCard(firstId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(secondId!)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(thirdId!)?.effectiveAp).toBe(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played during Main", () => {
    const first = createMockUnit();
    const second = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd01AssaultOnTorringtonBase114],
      play: [first, second],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targets = p1.getCardsInZone("battleArea");

    expectFailure(p1.playCommand(gd01AssaultOnTorringtonBase114, { targets }), "WRONG_TIMING");
  });

  it("rejects one target, duplicate targets, and an enemy target", () => {
    const first = createMockUnit();
    const second = createMockUnit();
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd01AssaultOnTorringtonBase114],
        play: [first, second],
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstId, secondId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(
      p1.playCommand(gd01AssaultOnTorringtonBase114, { targets: [firstId!] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01AssaultOnTorringtonBase114, { targets: [firstId!, firstId!] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01AssaultOnTorringtonBase114, { targets: [secondId!, enemyId] }),
      "INVALID_TARGET",
    );
  });

  it("plays as Yonem Kirks, applies AP+1/HP+0, and forms a Link through his printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Yonem Kirks]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01AssaultOnTorringtonBase114],
        resourceArea: activeResources(1),
      },
      { shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, commandId] = p1.getHand();

    expectSuccess(p1.deployUnit(hostId!));
    expectSuccess(p1.playCommandAsPilot(commandId!, hostId!));

    expect(p1.getPilotId(hostId!)).toBe(commandId);
    expect(p1.getCardZone(commandId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(hostId!)?.effectiveHp).toBe(3);
    expectSuccess(p1.enterBattle(hostId!, "direct"));
  });

  it("cannot be played below its printed Lv.1 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01AssaultOnTorringtonBase114],
      resourceArea: activeResources(0),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01AssaultOnTorringtonBase114), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01AssaultOnTorringtonBase114)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "【Main】Do nothing.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [setup, gd01AssaultOnTorringtonBase114],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
