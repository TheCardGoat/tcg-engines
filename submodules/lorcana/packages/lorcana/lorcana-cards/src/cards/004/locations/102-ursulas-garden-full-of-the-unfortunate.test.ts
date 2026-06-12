import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ursulasGardenFullOfTheUnfortunate } from "./102-ursulas-garden-full-of-the-unfortunate";

const gardenResident = createMockCharacter({
  id: "garden-resident",
  name: "Garden Resident",
  cost: 2,
});

const opposingGuest = createMockCharacter({
  id: "garden-opposing-guest",
  name: "Opposing Guest",
  cost: 2,
  lore: 2,
});

describe("Ursula's Garden - Full of the Unfortunate", () => {
  it("reduces opposing characters' lore while you have an exerted character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          ursulasGardenFullOfTheUnfortunate,
          { card: gardenResident, atLocation: ursulasGardenFullOfTheUnfortunate, exerted: true },
        ],
      },
      {
        play: [opposingGuest],
      },
    );

    expect(testEngine.asPlayerTwo().getCard(opposingGuest)?.lore).toBe(opposingGuest.lore - 1);
  });
});
