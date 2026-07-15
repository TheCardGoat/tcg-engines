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
import { gd01TheDesertTiger113 } from "./113-the-desert-tiger.ts";

describe("The Desert Tiger (GD01-113)", () => {
  it("【Main】 gives the chosen friendly ZAFT Unit AP+3 for the turn", () => {
    const chosen = createMockUnit({ ap: 2, traits: ["zaft"] });
    const other = createMockUnit({ ap: 3, traits: ["zaft"] });
    const engine = GundamTestEngine.create({
      hand: [gd01TheDesertTiger113],
      play: [chosen, other],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenId, otherId] = p1.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected The Desert Tiger to ask which friendly ZAFT Unit gains AP");
    }
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining([chosenId, otherId]));
    expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

    expect(p1.getVisibleCard(chosenId!)?.effectiveAp).toBe(5);
    expect(p1.getVisibleCard(otherId!)?.effectiveAp).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getVisibleCard(chosenId!)?.effectiveAp).toBe(2);
  });

  it("can give AP+3 during a legally reached Action step", () => {
    const chosen = createMockUnit({ ap: 2, traits: ["zaft"] });
    const engine = GundamTestEngine.create({
      hand: [gd01TheDesertTiger113],
      play: [chosen],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const chosenId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd01TheDesertTiger113));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected The Desert Tiger to ask which friendly ZAFT Unit gains AP");
    }
    expect(choice.legalTargetIds).toEqual([chosenId]);
    expectSuccess(p1.resolveEffect({ targets: [chosenId] }));

    expect(p1.getVisibleCard(chosenId)?.effectiveAp).toBe(5);
  });

  it("rejects a non-ZAFT friendly Unit and an enemy ZAFT Unit", () => {
    const friendly = createMockUnit({ traits: ["earth federation"] });
    const enemy = createMockUnit({ traits: ["zaft"] });
    const engine = GundamTestEngine.create(
      { hand: [gd01TheDesertTiger113], play: [friendly], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01TheDesertTiger113, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
    expectFailure(p1.playCommand(gd01TheDesertTiger113, { targets: [enemyId] }), "INVALID_TARGET");
  });

  it("plays as Andrew Waldfeld, applies AP+1/HP+0, and forms a Link through his printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Andrew Waldfeld]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01TheDesertTiger113],
        resourceArea: activeResources(3),
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

  it("cannot be played below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01TheDesertTiger113],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01TheDesertTiger113), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01TheDesertTiger113)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 3,
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
      hand: [setup, gd01TheDesertTiger113],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
