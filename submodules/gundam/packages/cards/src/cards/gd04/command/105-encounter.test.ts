import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createLogProjection,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Encounter105 } from "./105-encounter.ts";

describe("Encounter (GD04-105)", () => {
  it("【Main】adds the chosen revealed Pilot to hand and moves the Command to trash", () => {
    const pilot = createMockPilot({ name: "Searched Pilot", level: 1, cost: 1 });
    const fillers = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Filler ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      deck: [pilot, ...fillers],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(5);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const pilotId = choice.legalTutorCardIds[0]!;
    const resolution = p1.resolveEffect({
      deckLookAnswers: { 0: { tutorCardId: pilotId } },
    });
    expectSuccess(resolution);

    expect(p1.getHand()).toContain(pilotId);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);

    const logs = createLogProjection(resolution.success ? resolution.logEntries : []);
    const ownerLogs = logs.getForPlayer(asPlayerId(PLAYER_ONE));
    const opponentLogs = logs.getForPlayer(asPlayerId(PLAYER_TWO));
    expect(
      ownerLogs.find((entry) => entry.type === "gundam.effect.deckRevealed")?.message,
    ).toContain(pilotId);
    expect(opponentLogs.some((entry) => entry.type === "gundam.effect.deckRevealed")).toBe(false);
    expect(
      ownerLogs.find((entry) => entry.type === "gundam.effect.cardTutored")?.message,
    ).toContain(pilotId);
    expect(
      opponentLogs.find((entry) => entry.type === "gundam.effect.cardTutored")?.message,
    ).toContain(pilotId);
  });

  it("【Main】returns all 5 cards to the deck bottom when no Pilot is revealed", () => {
    const fillers = Array.from({ length: 5 }, (_, index) =>
      createMockUnit({ name: `Non-Pilot ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      deck: fillers,
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(5);
    expect(choice.legalTutorCardIds).toEqual([]);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { 0: {} } }));

    expect(p1.getCardsInZone("deck")).toHaveLength(5);
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not let the player choose the random bottom-deck order", () => {
    const fillers = Array.from({ length: 5 }, (_, index) =>
      createMockUnit({ name: `Random filler ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      deck: fillers,
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");

    expectFailure(
      p1.resolveEffect({
        deckLookAnswers: { 0: { toBottom: choice.revealedCardIds } },
      }),
      "INVALID_DECK_LOOK_ROUTING",
    );
    expect(p1.getBoardView().pendingChoice?.kind).toBe("deckLook");
    expect(p1.getCardsInZone("deck")).toHaveLength(5);

    expectSuccess(p1.resolveEffect({ deckLookAnswers: { 0: {} } }));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("deck")).toHaveLength(5);
  });

  it("uses the match seed to randomize the remaining cards server-side", () => {
    const firstRun = drawThreeRandomizedCards("encounter-random-a");
    const repeatedRun = drawThreeRandomizedCards("encounter-random-a");
    const differentSeedRun = drawThreeRandomizedCards("encounter-random-b");

    expect(firstRun).toEqual(repeatedRun);
    expect(firstRun).not.toEqual(differentSeedRun);
  });
});

function drawThreeRandomizedCards(seed: string): string[] {
  const drawSource = createMockUnit({
    name: "Draw source",
    effects: [
      {
        type: "activated",
        activation: { timing: ["activate:main"] },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "Draw 1.",
      },
    ],
  });
  const fillers = Array.from({ length: 5 }, (_, index) =>
    createMockUnit({ name: `Seeded filler ${index + 1}` }),
  );
  const engine = GundamTestEngine.create(
    {
      hand: [gd04Encounter105],
      play: [drawSource],
      deck: fillers,
      resourceArea: activeResources(5),
    },
    {},
    { seed },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const commandId = p1.getHand()[0]!;
  const drawSourceId = p1.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.playCommand(commandId));
  expectSuccess(p1.resolveEffect({ deckLookAnswers: { 0: {} } }));
  for (let draw = 0; draw < 3; draw++) {
    expectSuccess(p1.activateAbility(drawSourceId, 0));
  }

  return (p1.getView().zones.zones[`hand:${PLAYER_ONE}`]?.cards ?? [])
    .map((card) => card.definition?.name)
    .filter((name): name is string => name !== undefined);
}
