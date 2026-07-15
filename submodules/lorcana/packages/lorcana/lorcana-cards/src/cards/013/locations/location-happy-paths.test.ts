import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { vineEntranceOminousPassageway } from "./207-vine-entrance-ominous-passageway";

const floodbornTraveler = createMockCharacter({
  id: "vine-entrance-floodborn-traveler",
  name: "Floodborn Traveler",
  cost: 2,
  classifications: ["Floodborn", "Hero"],
});

const vineEntranceTarget = createMockCharacter({
  id: "vine-entrance-target",
  name: "Vine Entrance Target",
  cost: 2,
  willpower: 4,
});

describe("Set 13 location happy paths", () => {
  it("Vine Entrance - Ominous Passageway may deal 1 damage when a Floodborn character moves there", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [vineEntranceOminousPassageway, floodbornTraveler],
        inkwell: vineEntranceOminousPassageway.moveCost,
      },
      {
        play: [vineEntranceTarget],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(floodbornTraveler, vineEntranceOminousPassageway),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(vineEntranceOminousPassageway, {
        resolveOptional: true,
        targets: [vineEntranceTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(vineEntranceTarget)).toBe(1);
  });
});
