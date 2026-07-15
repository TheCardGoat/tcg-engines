import { describe, expect, it } from "bun:test";

import { hiddenCoveTranquilHaven } from "../../../../../lorcana-cards/src/cards/004/locations/101-hidden-cove-tranquil-haven";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../../testing";

const exertedTraveler = createMockCharacter({
  id: "exerted-traveler",
  name: "Exerted Traveler",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("moveCharacterToLocation", () => {
  it("allows an exerted character to move to a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: exertedTraveler, exerted: true }, hiddenCoveTranquilHaven],
      inkwell: hiddenCoveTranquilHaven.moveCost,
    });

    const result = testEngine
      .asPlayerOne()
      .moveCharacterToLocation(exertedTraveler, hiddenCoveTranquilHaven);

    expect(result.success).toBe(true);
    expect(testEngine.asPlayerOne().getCard(exertedTraveler).exerted).toBe(true);
    expect(testEngine.asPlayerOne().getCard(exertedTraveler).atLocationId).toBe(
      testEngine.asPlayerOne().getCard(hiddenCoveTranquilHaven).id,
    );

    const travelerId = testEngine.findCardInstanceId(exertedTraveler, "play", "player_one");
    const locationId = testEngine.findCardInstanceId(hiddenCoveTranquilHaven, "play", "player_one");
    const moveEntry = testEngine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "moveToLocation");

    expect(moveEntry).toMatchObject({
      moveType: "moveToLocation",
      playerId: "player_one",
      public: [
        {
          key: "lorcana.move.moveCharacterToLocation",
          values: {
            playerId: "player_one",
            characterId: travelerId,
            locationId,
          },
        },
      ],
    });
  });
});
