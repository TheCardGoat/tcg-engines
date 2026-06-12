import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rangerPlane } from "./167-ranger-plane";

const weakling = createMockCharacter({
  id: "ranger-plane-weakling",
  name: "Weakling",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const strongHero = createMockCharacter({
  id: "ranger-plane-strong-hero",
  name: "Strong Hero",
  cost: 9,
  strength: 10,
  willpower: 10,
  lore: 2,
});

describe("Ranger Plane", () => {
  it("AIR SUPPORT - your characters gain Support", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rangerPlane, weakling],
      deck: 3,
    });

    expect(testEngine.asPlayerOne().hasKeyword(weakling, "Support")).toBe(true);
  });

  it("BIG LIFT - chosen character with 10+ strength gets +3 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rangerPlane, strongHero],
      deck: 3,
    });

    expect(testEngine.asPlayerOne().getCardLore(strongHero)).toBe(2);

    expect(
      testEngine.asPlayerOne().activateAbility(rangerPlane, {
        ability: "BIG LIFT",
        targets: [strongHero],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(rangerPlane)).toBe(true);
    expect(testEngine.asPlayerOne().getCardLore(strongHero)).toBe(5);
  });

  it("BIG LIFT - cannot target characters with less than 10 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rangerPlane, weakling],
      deck: 3,
    });

    const result = testEngine.asPlayerOne().activateAbility(rangerPlane, {
      ability: "BIG LIFT",
      targets: [weakling],
    });

    expect(result).not.toBeSuccessfulCommand();
  });
});
