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
import { gd01FirstContact107 } from "./107-first-contact.ts";

describe("First Contact (GD01-107)", () => {
  it("【Burst】 places one active EX Resource after the player accepts the revealed Shield", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const host = createMockUnit({ ap: 2, hp: 4 });
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      { hand: [pilot], play: [host], shieldArea: [gd01FirstContact107], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    const resources = p1.getCardsInZone("resourceArea");
    expect(resources).toHaveLength(1);
    const exResourceId = resources[0]!;
    expect(p1.isExhausted(exResourceId)).toBe(false);

    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.assignPilot(pilot, hostId));
    expect(p1.getCardsInZone("resourceArea")).not.toContain(exResourceId);
    expect(p1.getCardsInZone("removalArea")).not.toContain(exResourceId);
    expect(p1.getCardZone(exResourceId)).toBeUndefined();
    expect(p1.getPilotId(hostId)).toBeDefined();
  });

  it("【Main】 places the top Resource from the resource deck rested and moves the Command to trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FirstContact107],
      resourceArea: activeResources(3),
      resourceDeck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const existingResources = new Set(p1.getCardsInZone("resourceArea"));
    const resourceDeckBefore = p1.getBoardView().players[PLAYER_ONE]!.resourceDeckCount;

    expectSuccess(p1.playCommand(commandId));

    const placedResourceId = p1
      .getCardsInZone("resourceArea")
      .find((cardId) => !existingResources.has(cardId));
    expect(placedResourceId).toBeDefined();
    expect(p1.isExhausted(placedResourceId!)).toBe(true);
    expect(p1.getBoardView().players[PLAYER_ONE]!.resourceDeckCount).toBe(resourceDeckBefore - 1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot use its Main effect in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FirstContact107],
      resourceArea: activeResources(3),
      resourceDeck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01FirstContact107), "WRONG_TIMING");
  });

  it("cannot be played below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FirstContact107],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01FirstContact107), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01FirstContact107)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 2 active Resources", () => {
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
      hand: [setup, gd01FirstContact107],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(2);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
