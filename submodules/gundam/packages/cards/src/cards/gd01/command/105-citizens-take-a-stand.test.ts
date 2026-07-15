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
import { gd01CitizensTakeAStand105 } from "./105-citizens-take-a-stand.ts";

describe("Citizens, Take a Stand! (GD01-105)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01CitizensTakeAStand105] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01CitizensTakeAStand105)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Main】 gives every friendly Unit AP+2 for the turn without affecting enemy Units", () => {
    const firstFriendly = createMockUnit({ ap: 2, hp: 5 });
    const secondFriendly = createMockUnit({ ap: 3, hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01CitizensTakeAStand105],
        play: [firstFriendly, secondFriendly],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstFriendlyId, secondFriendlyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getVisibleCard(firstFriendlyId!)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(secondFriendlyId!)?.effectiveAp).toBe(5);
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getVisibleCard(firstFriendlyId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(secondFriendlyId!)?.effectiveAp).toBe(3);
  });

  it("resolves and moves to trash when no friendly Units are in play", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01CitizensTakeAStand105],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot use its Main effect in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01CitizensTakeAStand105],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01CitizensTakeAStand105), "WRONG_TIMING");
  });

  it("cannot be played below its printed Lv.4 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01CitizensTakeAStand105],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01CitizensTakeAStand105), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01CitizensTakeAStand105)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 4,
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
      hand: [setup, gd01CitizensTakeAStand105],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
