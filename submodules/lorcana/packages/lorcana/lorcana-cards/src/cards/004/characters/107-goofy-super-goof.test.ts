import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { goofySuperGoof } from "./107-goofy-super-goof";

const exertedDefender = createMockCharacter({
  id: "goofy-super-goof-defender",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const targetLocation = createMockLocation({
  id: "goofy-super-goof-location",
  name: "Target Location",
  cost: 2,
  moveCost: 1,
  willpower: 8,
});

describe("Goofy - Super Goof", () => {
  it("can challenge the turn it is played because of Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goofySuperGoof],
        inkwell: goofySuperGoof.cost,
        deck: 5,
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goofySuperGoof)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(goofySuperGoof, exertedDefender),
    ).toBeSuccessfulCommand();
  });

  it("gains 2 lore when it challenges another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goofySuperGoof],
        inkwell: goofySuperGoof.cost,
        deck: 5,
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goofySuperGoof)).toBeSuccessfulCommand();

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().challenge(goofySuperGoof, exertedDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
  });

  it("does not gain lore when it challenges a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goofySuperGoof],
        inkwell: goofySuperGoof.cost,
        deck: 5,
      },
      {
        play: [targetLocation],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goofySuperGoof)).toBeSuccessfulCommand();

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().challenge(goofySuperGoof, targetLocation),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
  });
});
