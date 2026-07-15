import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { medalOfHeroes } from "./165-medal-of-heroes";

const decoratedHero = createMockCharacter({
  id: "medal-of-heroes-target",
  name: "Decorated Hero",
  cost: 3,
  lore: 1,
});

describe("Medal of Heroes", () => {
  it("gives your chosen character +2 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      inkwell: 2,
      play: [medalOfHeroes, decoratedHero],
    });
    const baseLore = testEngine.asPlayerOne().getCardLore(decoratedHero);

    expect(
      testEngine.asPlayerOne().activateAbility(medalOfHeroes, {
        targets: [decoratedHero],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(decoratedHero)).toBe(baseLore + 2);
    expect(testEngine.asPlayerOne().getCardZone(medalOfHeroes)).toBe("discard");
  });
});
