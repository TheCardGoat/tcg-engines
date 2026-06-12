import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleSnowfieldStrategistEnchanted } from "./236-belle-snowfield-strategist-enchanted";

const sacrificialCharacter = createMockCharacter({
  id: "belle-enc-sacrifice",
  name: "Belle Enc Sacrifice",
  cost: 2,
  strength: 2,
  willpower: 1,
});

const opponentAttacker = createMockCharacter({
  id: "belle-enc-opponent-attacker",
  name: "Belle Enc Opponent Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Belle - Snowfield Strategist Enchanted", () => {
  it("puts banished character from discard into inkwell facedown and exerted when accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [belleSnowfieldStrategistEnchanted, { card: sacrificialCharacter, exerted: true }],
        deck: 2,
      },
      {
        play: [opponentAttacker],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges the sacrificial character to banish it
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, sacrificialCharacter),
    ).toBeSuccessfulCommand();

    // Belle's WINTER STOCKPILE triggers - accept the optional ability
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleSnowfieldStrategistEnchanted, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // The banished character should now be in the inkwell
    expect(testEngine.asPlayerOne().getCardZone(sacrificialCharacter)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);

    // It should be exerted and facedown
    const cardInstanceId = testEngine.findCardInstanceId(sacrificialCharacter, "inkwell", "p1");
    const card = testEngine.asServer().getCard(cardInstanceId);
    expect(card.exerted).toBe(true);
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[cardInstanceId]
        ?.publicFaceState,
    ).toBe("faceDown");
  });

  it("does not move the card when the optional ability is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [belleSnowfieldStrategistEnchanted, { card: sacrificialCharacter, exerted: true }],
        deck: 2,
      },
      {
        play: [opponentAttacker],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges the sacrificial character to banish it
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, sacrificialCharacter),
    ).toBeSuccessfulCommand();

    // Belle's WINTER STOCKPILE triggers - decline the optional ability
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleSnowfieldStrategistEnchanted, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // The banished character should remain in the discard
    expect(testEngine.asPlayerOne().getCardZone(sacrificialCharacter)).toBe("discard");
  });

  it("does not trigger when an opponent's character is banished", () => {
    const opponentCharacter = createMockCharacter({
      id: "belle-enc-opp-char",
      name: "Opponent Character",
      cost: 2,
      strength: 1,
      willpower: 1,
    });

    const playerAttacker = createMockCharacter({
      id: "belle-enc-player-attacker",
      name: "Player Attacker",
      cost: 3,
      strength: 5,
      willpower: 5,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [belleSnowfieldStrategistEnchanted, playerAttacker],
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent quests with their character (exerting it)
    expect(testEngine.asPlayerTwo().quest(opponentCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Player one challenges opponent's exerted character to banish it
    expect(
      testEngine.asPlayerOne().challenge(playerAttacker, opponentCharacter),
    ).toBeSuccessfulCommand();

    // No trigger should fire for Belle since it was an opponent's character
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
