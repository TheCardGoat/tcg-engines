import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleSnowfieldStrategist } from "./158-belle-snowfield-strategist";
import { galeWindSpirit } from "../../005/characters/042-gale-wind-spirit";

const sacrificialCharacter = createMockCharacter({
  id: "belle-sacrifice",
  name: "Belle Sacrifice",
  cost: 2,
  strength: 2,
  willpower: 1,
});

const extraDiscardCharacter = createMockCharacter({
  id: "belle-extra-discard",
  name: "Belle Extra Discard",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opponentAttacker = createMockCharacter({
  id: "belle-opponent-attacker",
  name: "Belle Opponent Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Belle - Snowfield Strategist", () => {
  it("puts banished character from discard into inkwell facedown and exerted when accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [belleSnowfieldStrategist, { card: sacrificialCharacter, exerted: true }],
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
      testEngine.asPlayerOne().resolvePendingByCard(belleSnowfieldStrategist, {
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

  it("does not put the card into the inkwell if it leaves the discard before WINTER STOCKPILE resolves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [belleSnowfieldStrategist, { card: galeWindSpirit, exerted: true }],
        deck: 2,
      },
      {
        play: [opponentAttacker],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, galeWindSpirit),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

    expect(testEngine.asPlayerOne().resolvePendingByCard(galeWindSpirit)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(galeWindSpirit)).toBe("hand");

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleSnowfieldStrategist, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(galeWindSpirit)).toBe("hand");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("triggers WINTER STOCKPILE when Belle herself is banished (self-count)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: belleSnowfieldStrategist, exerted: true }],
        deck: 2,
      },
      {
        play: [opponentAttacker],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges Belle herself — she is banished
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, belleSnowfieldStrategist),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(belleSnowfieldStrategist)).toBe("discard");

    // Belle's WINTER STOCKPILE should fire for her own banishment
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleSnowfieldStrategist, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // Belle should now be in the inkwell
    expect(testEngine.asPlayerOne().getCardZone(belleSnowfieldStrategist)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);

    // It should be exerted and facedown
    const cardInstanceId = testEngine.findCardInstanceId(belleSnowfieldStrategist, "inkwell", "p1");
    const card = testEngine.asServer().getCard(cardInstanceId);
    expect(card.exerted).toBe(true);
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[cardInstanceId]
        ?.publicFaceState,
    ).toBe("faceDown");
  });

  it("tracks only the triggering card instance even when another discard card exists", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [belleSnowfieldStrategist, { card: sacrificialCharacter, exerted: true }],
        discard: [extraDiscardCharacter],
        deck: 2,
      },
      {
        play: [opponentAttacker],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, sacrificialCharacter),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleSnowfieldStrategist, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(sacrificialCharacter)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(extraDiscardCharacter)).toBe("discard");
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
});
