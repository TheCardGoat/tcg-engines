import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { enigmaticInkcaster } from "./100-enigmatic-inkcaster";

const firstCard = createMockCharacter({
  id: "enigmatic-inkcaster-first-card",
  name: "First Card",
  cost: 1,
});

const secondCard = createMockCharacter({
  id: "enigmatic-inkcaster-second-card",
  name: "Second Card",
  cost: 1,
});

describe("Enigmatic Inkcaster", () => {
  it("ITS OWN REWARD - gains 1 lore when 2 or more cards have been played this turn (including itself)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [firstCard, enigmaticInkcaster],
      inkwell: firstCard.cost + enigmaticInkcaster.cost,
    });

    expect(testEngine.asPlayerOne().playCard(firstCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(enigmaticInkcaster)).toBeSuccessfulCommand();

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().activateAbility(enigmaticInkcaster, {
        ability: "ITS OWN REWARD",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
  });

  it("ITS OWN REWARD - gains 1 lore when 3 cards have been played this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [firstCard, secondCard, enigmaticInkcaster],
      inkwell: firstCard.cost + secondCard.cost + enigmaticInkcaster.cost,
    });

    expect(testEngine.asPlayerOne().playCard(firstCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(secondCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(enigmaticInkcaster)).toBeSuccessfulCommand();

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().activateAbility(enigmaticInkcaster, {
        ability: "ITS OWN REWARD",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
  });

  it("ITS OWN REWARD - does not gain lore when only 1 card has been played this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [enigmaticInkcaster],
      inkwell: enigmaticInkcaster.cost,
    });

    expect(testEngine.asPlayerOne().playCard(enigmaticInkcaster)).toBeSuccessfulCommand();

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    // Only 1 card played this turn — condition gte 2 not met, activation is rejected
    expect(
      testEngine.asPlayerOne().activateAbility(enigmaticInkcaster, {
        ability: "ITS OWN REWARD",
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
  });
});
