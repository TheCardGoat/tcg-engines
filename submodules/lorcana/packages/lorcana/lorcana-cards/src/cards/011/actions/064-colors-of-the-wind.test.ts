import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire, heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { jasmineSteadyStrategist } from "../../008";
import { colorsOfTheWind } from "./064-colors-of-the-wind";

describe("Colors of the Wind", () => {
  it("draws for each distinct single ink type revealed", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [colorsOfTheWind],
        inkwell: colorsOfTheWind.cost,
        deck: [heiheiBoatSnack, mickeyMouseTrueFriend, dragonFire],
      },
      {
        deck: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(colorsOfTheWind)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("counts both ink types on a dual-ink revealed card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [colorsOfTheWind],
        inkwell: colorsOfTheWind.cost,
        deck: [heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub, jasmineSteadyStrategist],
      },
      {
        deck: [dragonFire],
      },
    );

    expect(testEngine.asPlayerOne().playCard(colorsOfTheWind)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
  });

  it("regression: works correctly when sung (played via singing) instead of paying ink", () => {
    const singer = createMockCharacter({
      id: "colors-test-singer",
      name: "Singer",
      cost: 4,
      strength: 2,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [colorsOfTheWind],
        play: [singer],
        deck: [heiheiBoatSnack, mickeyMouseTrueFriend, dragonFire],
      },
      {
        deck: [simbaProtectiveCub],
      },
    );

    const singerId = testEngine.findCardInstanceId(singer, "play", "p1");

    // Sing Colors of the Wind instead of paying ink
    expect(testEngine.asPlayerOne().singSong(colorsOfTheWind, singer)).toBeSuccessfulCommand();

    // Should still reveal and draw cards based on distinct ink types
    // heiheiBoatSnack is amber, simbaProtectiveCub is amber = 1 distinct type
    // But the top card is heiheiBoatSnack and opponent's top is simbaProtectiveCub
    // Both amber = 1 type = draw 1 card
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBeGreaterThanOrEqual(1);
  });
});
