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
import { gd01InterceptOrders099 } from "./099-intercept-orders.ts";
import { gd01TheStubbornCog103 } from "./103-the-stubborn-cog.ts";

describe("The Stubborn Cog (GD01-103)", () => {
  it("【Main】 rests the chosen active Earth Federation Unit and active enemy Unit", () => {
    const friendly = createMockUnit({ traits: ["earth federation"] });
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd01TheStubbornCog103],
        play: [friendly],
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected separate friendly and enemy target groups");
    }
    expect(choice.groups).toHaveLength(2);
    expect(choice.groups[0]?.legalTargetIds).toEqual([friendlyId]);
    expect(choice.groups[1]?.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [friendlyId, enemyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p2.isExhausted(enemyId)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("rejects a friendly Unit without the Earth Federation trait", () => {
    const friendly = createMockUnit({ traits: ["zeon"] });
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [gd01TheStubbornCog103], play: [friendly], resourceArea: activeResources(1) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01TheStubbornCog103, { targets: [friendlyId, enemyId] }),
      "INVALID_TARGET",
    );
  });

  it("rejects a rested Unit on either side", () => {
    const friendly = createMockUnit({
      traits: ["earth federation"],
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const supportTarget = createMockUnit();
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01InterceptOrders099, gd01TheStubbornCog103],
        play: [friendly, supportTarget],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [friendlyId, supportTargetId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [interceptOrdersId, stubbornCogId] = p1.getHand();

    expectSuccess(p1.useSupport(friendlyId!, supportTargetId!));
    expectSuccess(p1.playCommand(interceptOrdersId!));
    const setupChoice = p1.getBoardView().pendingChoice;
    if (setupChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expect(setupChoice.legalTargetIds).toContain(enemyId);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p1.isExhausted(friendlyId!)).toBe(true);
    expect(p2.isExhausted(enemyId)).toBe(true);

    expectFailure(
      p1.playCommand(stubbornCogId!, { targets: [friendlyId!, enemyId] }),
      "INVALID_TARGET",
    );
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01TheStubbornCog103],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01TheStubbornCog103), "WRONG_TIMING");
  });

  it("plays as Daguza Mackle, applies AP+0/HP+1, and forms a Link through his printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Daguza Mackle]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01TheStubbornCog103],
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
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(hostId!)?.effectiveHp).toBe(4);
    expectSuccess(p1.enterBattle(hostId!, "direct"));
  });

  it("cannot be played below its printed Lv.1 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01TheStubbornCog103],
      resourceArea: activeResources(0),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01TheStubbornCog103), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01TheStubbornCog103)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd01TheStubbornCog103],
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
