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
import { gd01ZeonRemnantForces115 } from "./115-zeon-remnant-forces.ts";

describe("Zeon Remnant Forces (GD01-115)", () => {
  it("【Main】 deals 1 damage to the chosen enemy Unit", () => {
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd01ZeonRemnantForces115], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Zeon Remnant Forces to ask which enemy Unit receives damage");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can destroy the chosen enemy Unit during a legally reached Action step", () => {
    const enemy = createMockUnit({ hp: 1 });
    const engine = GundamTestEngine.create(
      { hand: [gd01ZeonRemnantForces115], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd01ZeonRemnantForces115));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Zeon Remnant Forces to ask which enemy Unit receives damage");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("rejects a friendly Unit", () => {
    const friendly = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd01ZeonRemnantForces115],
      play: [friendly],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01ZeonRemnantForces115, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
  });

  it("cannot be played below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01ZeonRemnantForces115],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01ZeonRemnantForces115), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01ZeonRemnantForces115)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 2,
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
      hand: [setup, gd01ZeonRemnantForces115],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
