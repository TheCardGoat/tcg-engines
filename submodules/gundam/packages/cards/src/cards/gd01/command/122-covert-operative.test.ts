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
import { gd01CovertOperative122 } from "./122-covert-operative.ts";

describe("Covert Operative (GD01-122)", () => {
  it("【Main】 returns an enemy Unit with 2 HP when no friendly Link Unit is in play", () => {
    const enemy = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd01CovertOperative122], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Covert Operative to ask which eligible enemy Unit returns to hand");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("uses the 4-HP branch after a Pilot legally forms a friendly Link Unit", () => {
    const pilot = createMockPilot({ name: "Setup Pilot", level: 1, cost: 1 });
    const host = createMockUnit({ linkCondition: "[Setup Pilot]" });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd01CovertOperative122],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [pilotId, commandId] = p1.getHand();

    expectSuccess(p1.assignPilot(pilotId!, hostId));
    expectSuccess(p1.playCommand(commandId!));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Covert Operative's Link branch to offer the 4-HP enemy Unit");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("rejects 3 HP without a Link Unit and 5 HP with a Link Unit", () => {
    const pilot = createMockPilot({ name: "Setup Pilot", level: 1, cost: 1 });
    const host = createMockUnit({ linkCondition: "[Setup Pilot]" });
    const mediumEnemy = createMockUnit({ hp: 3 });
    const toughEnemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd01CovertOperative122],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [mediumEnemy, toughEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [mediumEnemyId, toughEnemyId] = p2.getCardsInZone("battleArea");
    const [pilotId, commandId] = p1.getHand();

    expectFailure(p1.playCommand(commandId!, { targets: [mediumEnemyId!] }), "INVALID_TARGET");
    expectSuccess(p1.assignPilot(pilotId!, hostId));
    expectFailure(p1.playCommand(commandId!, { targets: [toughEnemyId!] }), "INVALID_TARGET");
  });

  it("rejects a qualifying friendly Unit and cannot be played in an Action step", () => {
    const friendly = createMockUnit({ hp: 2 });
    const enemy = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01CovertOperative122],
        play: [friendly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01CovertOperative122, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.playCommand(gd01CovertOperative122, { targets: [enemyId] }), "WRONG_TIMING");
  });

  it("plays as Shaddiq Zenelli, applies AP+1/HP+0, and forms a Link through his printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Shaddiq Zenelli]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01CovertOperative122],
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
      hand: [gd01CovertOperative122],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01CovertOperative122), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01CovertOperative122)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd01CovertOperative122],
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
