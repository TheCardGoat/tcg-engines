import { describe, expect, it } from "bun:test";

import { hiddenCoveTranquilHaven } from "../../../../../lorcana-cards/src/cards/004/locations/101-hidden-cove-tranquil-haven";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../../testing";
import { PLAYER_ONE } from "../../../testing/unit-harness";

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

  it("lets ink drops cover the whole move cost without throwing after payment", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [exertedTraveler, hiddenCoveTranquilHaven],
      inkwell: 1,
      inkDrops: 2,
      deck: 5,
    });

    // Regression: the shortfall check used to measure the held-drop balance
    // AFTER spendInk had already removed the claimed drops, so a fully
    // drop-funded move saw 0 held drops and threw — keeping the consumed
    // drops while the character never moved.
    const result = testEngine
      .asPlayerOne()
      .moveCharacterToLocation(exertedTraveler, hiddenCoveTranquilHaven, { inkDrops: 2 });

    expect(result.success).toBe(true);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCard(exertedTraveler).atLocationId).toBe(
      testEngine.asPlayerOne().getCard(hiddenCoveTranquilHaven).id,
    );
  });

  it("lets ink drops cover part of the move cost alongside exerted ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [exertedTraveler, hiddenCoveTranquilHaven],
      inkwell: 1,
      inkDrops: 1,
      deck: 5,
    });

    const result = testEngine
      .asPlayerOne()
      .moveCharacterToLocation(exertedTraveler, hiddenCoveTranquilHaven, { inkDrops: 1 });

    expect(result.success).toBe(true);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCard(exertedTraveler).atLocationId).toBe(
      testEngine.asPlayerOne().getCard(hiddenCoveTranquilHaven).id,
    );
  });
});
