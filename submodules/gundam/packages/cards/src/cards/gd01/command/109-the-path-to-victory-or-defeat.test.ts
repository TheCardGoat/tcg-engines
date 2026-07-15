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
import { gd01ThePathToVictoryOrDefeat109 } from "./109-the-path-to-victory-or-defeat.ts";

function fillers() {
  return Array.from({ length: 4 }, (_, index) =>
    createMockUnit({ name: `Filler ${index + 1}`, traits: ["earth federation"] }),
  );
}

describe("The Path to Victory or Defeat (GD01-109)", () => {
  it("tutors an eligible Unit, bottoms the looked cards, and leaves the untouched card for the next draw", () => {
    const eligible = createMockUnit({
      name: "Operation Meteor Unit",
      traits: ["operation meteor"],
    });
    const sentinel = createMockUnit({ name: "Untouched Sentinel" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ThePathToVictoryOrDefeat109],
        deck: [sentinel, eligible, ...fillers()],
        resourceArea: activeResources(5),
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected the player-visible deck look");
    expect(choice.revealedCardIds).toHaveLength(5);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const eligibleId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: eligibleId } },
      }),
    );

    expect(p1.getCardZone(eligibleId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(5);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);

    const visibleHandBeforeDraw = new Set(p1.getHand());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p1.getHand().filter((cardId) => !visibleHandBeforeDraw.has(cardId))).toHaveLength(1);
    expect(p1.getCardZone(sentinel)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);
  });

  it("also offers an eligible G Team Pilot and allows the player to decline it", () => {
    const eligible = createMockPilot({ name: "G Team Pilot", traits: ["g team"] });
    const engine = GundamTestEngine.create({
      hand: [gd01ThePathToVictoryOrDefeat109],
      deck: [eligible, ...fillers()],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.playCommand(gd01ThePathToVictoryOrDefeat109));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected the player-visible deck look");
    expect(choice.legalTutorCardIds).toHaveLength(1);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

    expect(p1.getHand()).toHaveLength(handBefore - 1);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(5);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("shows no tutor option when none of the five revealed cards match", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01ThePathToVictoryOrDefeat109],
      deck: [createMockUnit({ name: "Other" }), ...fillers()],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd01ThePathToVictoryOrDefeat109));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected the player-visible deck look");
    expect(choice.revealedCardIds).toHaveLength(5);
    expect(choice.legalTutorCardIds).toHaveLength(0);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(5);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01ThePathToVictoryOrDefeat109],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01ThePathToVictoryOrDefeat109), "WRONG_TIMING");
  });

  it("cannot be played below its printed Lv.5 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01ThePathToVictoryOrDefeat109],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01ThePathToVictoryOrDefeat109), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01ThePathToVictoryOrDefeat109)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 5,
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
      hand: [setup, gd01ThePathToVictoryOrDefeat109],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
