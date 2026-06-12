import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyMusketeer } from "./004-goofy-musketeer";
import { donaldDuckMusketeer } from "./177-donald-duck-musketeer";
import { mickeyMouseMusketeer } from "./186-mickey-mouse-musketeer";

const nonMusketeerCharacter = createMockCharacter({
  id: "goofy-musketeer-non-musketeer",
  name: "Non Musketeer Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Goofy - Musketeer", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyMusketeer],
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: goofyMusketeer,
      keyword: "Bodyguard",
    });
  });

  it("AND TWO FOR TEA! removes up to 2 damage from each of your Musketeer characters when accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goofyMusketeer],
      inkwell: goofyMusketeer.cost,
      deck: 1,
      play: [
        { card: donaldDuckMusketeer, damage: 2 },
        { card: mickeyMouseMusketeer, damage: 3 },
        { card: nonMusketeerCharacter, damage: 2 },
      ],
    });

    expect(testEngine.asPlayerOne().playCard(goofyMusketeer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goofyMusketeer, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(donaldDuckMusketeer)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseMusketeer)).toBe(1);
    expect(testEngine.asPlayerOne().getDamage(nonMusketeerCharacter)).toBe(2);
  });
});
