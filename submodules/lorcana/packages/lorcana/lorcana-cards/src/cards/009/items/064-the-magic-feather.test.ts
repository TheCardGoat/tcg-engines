import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theMagicFeather } from "./064-the-magic-feather";

const chosenCharacter = createMockCharacter({
  id: "magic-feather-chosen-character",
  name: "Chosen Character",
  cost: 2,
});

describe("The Magic Feather", () => {
  it("returns itself to your hand with GROUNDED 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 3,
      play: [theMagicFeather],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theMagicFeather, {
        ability: "GROUNDED 3",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theMagicFeather)).toBe("hand");
  });

  it("NOW YOU CAN FLY! grants Evasive to chosen character while in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: theMagicFeather.cost,
      hand: [theMagicFeather],
      play: [chosenCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(theMagicFeather)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theMagicFeather, {
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: chosenCharacter, keyword: "Evasive" });
  });

  it("character loses Evasive when The Magic Feather leaves play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: theMagicFeather.cost + 3,
      hand: [theMagicFeather],
      play: [chosenCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(theMagicFeather)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theMagicFeather, {
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: chosenCharacter, keyword: "Evasive" });

    expect(
      testEngine.asPlayerOne().activateAbility(theMagicFeather, {
        ability: "GROUNDED 3",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).not.toHaveKeyword({
      card: chosenCharacter,
      keyword: "Evasive",
    });
  });
});
