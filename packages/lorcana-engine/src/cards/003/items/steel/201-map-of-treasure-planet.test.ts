/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mapOfTreasurePlanet } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { bellesHouseMauricesWorkshop } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Map of Treasure Planet", () => {
  it("**KEY TO THE PORTAL** {E} – You pay 1 {I} less for the next location you play this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: bellesHouseMauricesWorkshop.cost - 1,
      hand: [bellesHouseMauricesWorkshop],
      play: [mapOfTreasurePlanet],
    });

    const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);

    expect(location.cost).toEqual(bellesHouseMauricesWorkshop.cost);
    await testEngine.activateCard(mapOfTreasurePlanet);
    expect(location.cost).toEqual(bellesHouseMauricesWorkshop.cost - 1);

    await testEngine.playCard(bellesHouseMauricesWorkshop);

    expect(location.zone).toEqual("play");
  });

  it("**Show the Way** You pay 1 {I} less to move your characters to a location.", async () => {
    const testEngine = new TestEngine({
      inkwell: mapOfTreasurePlanet.cost,
      hand: [mapOfTreasurePlanet],
      play: [bellesHouseMauricesWorkshop, mickeyBraveLittleTailor],
    });

    const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);
    const char = testEngine.getCardModel(mickeyBraveLittleTailor);

    expect(location.moveCostToEnterLocation(char)).toEqual(
      bellesHouseMauricesWorkshop.moveCost,
    );

    await testEngine.playCard(mapOfTreasurePlanet);

    expect(testEngine.getCardModel(mapOfTreasurePlanet).zone).toEqual("play");
    expect(location.moveCostToEnterLocation(char)).toEqual(
      bellesHouseMauricesWorkshop.moveCost - 1,
    );
  });
});
