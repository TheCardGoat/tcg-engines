import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { touchTheSky } from "./199-touch-the-sky";

const moverCharacter = createMockCharacter({
  id: "touch-the-sky-character",
  name: "Mover",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const location = createMockLocation({
  id: "touch-the-sky-location",
  name: "Sky Location",
  cost: 3,
  moveCost: 2,
  willpower: 6,
  lore: 2,
});

describe("Touch the Sky", () => {
  it("moves your character to a location for free and draws cards equal to that location's lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [touchTheSky],
      inkwell: touchTheSky.cost,
      play: [moverCharacter, location],
      deck: 5,
    });

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    expect(
      testEngine.asPlayerOne().playCard(touchTheSky, {
        targets: [moverCharacter, location],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: moverCharacter,
      location,
    });

    // Played touchTheSky from hand (-1), then drew 2 cards equal to location's lore (+2)
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore - 1 + location.lore);
  });
});
