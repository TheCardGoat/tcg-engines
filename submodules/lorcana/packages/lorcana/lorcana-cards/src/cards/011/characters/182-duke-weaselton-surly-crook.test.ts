import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dukeWeaseltonSurlyCrook } from "./182-duke-weaselton-surly-crook";

const cheapCharacter = createMockCharacter({
  id: "duke-cheap-char",
  name: "Cheap Character",
  strength: 1,
  willpower: 1,
  cost: 2,
});

describe("Duke Weaselton - Surly Crook", () => {
  it("triggers APPREHENDED when banished, creating a bag effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dukeWeaseltonSurlyCrook],
      hand: [cheapCharacter],
      deck: 5,
    });

    // Banish Duke via lethal damage
    testEngine.asServer().manualSetDamage(dukeWeaseltonSurlyCrook, 3);

    expect(testEngine.asPlayerOne().getCardZone(dukeWeaseltonSurlyCrook)).toBe("discard");

    // The triggered ability should create a bag effect for the optional play
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });

  it("APPREHENDED - plays cheap character for free when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dukeWeaseltonSurlyCrook],
      hand: [cheapCharacter],
      deck: 5,
    });

    testEngine.asServer().manualSetDamage(dukeWeaseltonSurlyCrook, 3);

    expect(testEngine.asPlayerOne().getCardZone(dukeWeaseltonSurlyCrook)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(dukeWeaseltonSurlyCrook, {
        resolveOptional: true,
        targets: [cheapCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
  });

  it("allows declining the optional play when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dukeWeaseltonSurlyCrook],
      hand: [cheapCharacter],
      deck: 5,
    });

    testEngine.asServer().manualSetDamage(dukeWeaseltonSurlyCrook, 3);

    expect(testEngine.asPlayerOne().getCardZone(dukeWeaseltonSurlyCrook)).toBe("discard");

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(dukeWeaseltonSurlyCrook, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
  });

  it("regression: APPREHENDED should NOT trigger when a different character is banished (only self-banish)", () => {
    // Bug: Duke Weaselton was triggering on any character banished, not just when he himself was banished.
    const otherCharacter = createMockCharacter({
      id: "duke-other-char",
      name: "Other Character",
      strength: 1,
      willpower: 1,
      cost: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dukeWeaseltonSurlyCrook, otherCharacter],
      hand: [cheapCharacter],
      deck: 5,
    });

    // Banish the other character (not Duke Weaselton)
    testEngine.asServer().manualSetDamage(otherCharacter, 1);

    expect(testEngine.asPlayerOne().getCardZone(otherCharacter)).toBe("discard");
    // Duke should still be in play
    expect(testEngine.asPlayerOne().getCardZone(dukeWeaseltonSurlyCrook)).toBe("play");

    // APPREHENDED should NOT have triggered
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
