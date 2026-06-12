import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, PLAYER_ONE } from "./testing";

const drawThenOptionalPlayCharacter = createMockCharacter({
  id: "draw-then-optional-play",
  name: "Draw Then Optional Play",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "draw-then-optional-play-1",
      name: "Draw Then Optional Play",
      text: "Whenever this character quests, draw a card. Then you may play a character with cost 2 or less for free.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "play-card",
              from: "hand",
              cardType: "character",
              cost: "free",
              costRestriction: {
                comparison: "less-or-equal",
                value: 2,
              },
            },
          },
        ],
      },
    },
  ],
});

const cheapCharacter = createMockCharacter({
  id: "cheap-character",
  name: "Cheap Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("sequence-with-optional: no auto-accept for nested optionals (Woody Jungle Guide bug)", () => {
  it("auto-drains the mandatory draw and leaves the optional pending in the bag", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [drawThenOptionalPlayCharacter],
        hand: [],
        inkwell: 5,
        deck: [cheapCharacter],
        lore: 0,
      },
      { deck: 10, lore: 0 },
    );

    expect(testEngine.asPlayerOne().quest(drawThenOptionalPlayCharacter)).toBeSuccessfulCommand();

    // Auto-drain runs the mandatory draw; the optional play-card step remains in
    // the bag (rewritten to just the optional) awaiting the player's confirmation.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.getServerEngine().getCardsInZone("hand", PLAYER_ONE).cards).toHaveLength(1);
  });

  it("does not auto-play the drawn character when the player declines the optional", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [drawThenOptionalPlayCharacter],
        hand: [],
        inkwell: 5,
        deck: [cheapCharacter],
        lore: 0,
      },
      { deck: 10, lore: 0 },
    );

    expect(testEngine.asPlayerOne().quest(drawThenOptionalPlayCharacter)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    const handCards = testEngine.getServerEngine().getCardsInZone("hand", PLAYER_ONE).cards;
    expect(handCards).toHaveLength(1);

    const playCards = testEngine.getServerEngine().getCardsInZone("play", PLAYER_ONE).cards;
    expect(playCards).toHaveLength(1);
  });

  it("allows the player to accept and play the drawn character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [drawThenOptionalPlayCharacter],
        hand: [],
        inkwell: 5,
        deck: [cheapCharacter],
        lore: 0,
      },
      { deck: 10, lore: 0 },
    );

    expect(testEngine.asPlayerOne().quest(drawThenOptionalPlayCharacter)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();

    const playCards = testEngine.getServerEngine().getCardsInZone("play", PLAYER_ONE).cards;
    expect(playCards).toHaveLength(2);
  });

  it("auto-drains when the drawn card is not a character with cost <= 2", () => {
    const expensiveCharacter = createMockCharacter({
      id: "expensive-character",
      name: "Expensive Character",
      cost: 5,
      strength: 3,
      willpower: 4,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [drawThenOptionalPlayCharacter],
        hand: [],
        inkwell: 5,
        deck: [expensiveCharacter],
        lore: 0,
      },
      { deck: 10, lore: 0 },
    );

    expect(testEngine.asPlayerOne().quest(drawThenOptionalPlayCharacter)).toBeSuccessfulCommand();

    // Drew the expensive character; optional has no eligible candidates and auto-declines.
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    const handCards = testEngine.getServerEngine().getCardsInZone("hand", PLAYER_ONE).cards;
    expect(handCards).toHaveLength(1);
  });
});
