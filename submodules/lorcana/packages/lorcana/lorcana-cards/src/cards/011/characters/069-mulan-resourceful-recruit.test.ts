import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { lingSnowWarrior } from "./075-ling-snow-warrior";
import { mulanResourcefulRecruit } from "./069-mulan-resourceful-recruit";

describe("Mulan - Resourceful Recruit", () => {
  it("gains lore equal to her current strength when she quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: mulanResourcefulRecruit, isDrying: false },
        { card: lingSnowWarrior, isDrying: false },
      ],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(mulanResourcefulRecruit)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("uses her increased strength when calculating the lore gained", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: mulanResourcefulRecruit, isDrying: false },
        { card: lingSnowWarrior, isDrying: false },
      ],
      inkwell: 2,
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
        targets: [mulanResourcefulRecruit],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
        targets: [mulanResourcefulRecruit],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(mulanResourcefulRecruit)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(3);
  });

  it("caps the lore gained at 6", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: mulanResourcefulRecruit, isDrying: false },
        { card: lingSnowWarrior, isDrying: false },
      ],
      inkwell: 6,
      deck: 5,
    });

    for (let index = 0; index < 6; index += 1) {
      expect(
        testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
          targets: [mulanResourcefulRecruit],
        }),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCardStrength(mulanResourcefulRecruit)).toBe(7);
    expect(testEngine.asPlayerOne().quest(mulanResourcefulRecruit)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(6);
  });

  it("gains exactly 6 lore when her strength is exactly 6", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: mulanResourcefulRecruit, isDrying: false },
        { card: lingSnowWarrior, isDrying: false },
      ],
      inkwell: 5,
      deck: 5,
    });

    for (let index = 0; index < 5; index += 1) {
      expect(
        testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
          targets: [mulanResourcefulRecruit],
        }),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCardStrength(mulanResourcefulRecruit)).toBe(6);
    expect(testEngine.asPlayerOne().quest(mulanResourcefulRecruit)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(6);
  });
});
