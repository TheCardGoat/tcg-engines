import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { spaghettiDinner } from "./042-spaghetti-dinner";

const dinerOne = createMockCharacter({
  id: "spaghetti-dinner-diner-one",
  name: "Diner One",
  cost: 1,
});

const dinerTwo = createMockCharacter({
  id: "spaghetti-dinner-diner-two",
  name: "Diner Two",
  cost: 1,
});

describe("Spaghetti Dinner", () => {
  it("gains 1 lore if you have 2 or more characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [spaghettiDinner, dinerOne, dinerTwo],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(spaghettiDinner, {
        ability: "FINE DINING",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not gain lore if you have fewer than 2 characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [spaghettiDinner, dinerOne],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(spaghettiDinner, {
        ability: "FINE DINING",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("regression: should not be activatable with zero characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [spaghettiDinner],
      // No characters in play at all
    });

    // The ability should still be activatable (exert + pay ink), but condition fails
    expect(
      testEngine.asPlayerOne().activateAbility(spaghettiDinner, {
        ability: "FINE DINING",
      }),
    ).toBeSuccessfulCommand();

    // No lore gained because condition requires 2+ characters
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
