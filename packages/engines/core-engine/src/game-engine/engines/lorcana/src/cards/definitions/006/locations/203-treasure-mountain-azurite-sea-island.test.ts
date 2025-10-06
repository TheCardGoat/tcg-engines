/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  kakamoraBoardingParty,
  sisuInHerElement,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import { treasureMountainAzuriteSeaIsland } from "~/game-engine/engines/lorcana/src/cards/definitions/006/locations/locations";

describe("Treasure Mountain - Azurite Sea Island", () => {
  it("SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: treasureMountainAzuriteSeaIsland.moveCost * 2,
        play: [
          treasureMountainAzuriteSeaIsland,
          sisuInHerElement,
          kakamoraBoardingParty,
        ],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    for (const card of [sisuInHerElement, kakamoraBoardingParty]) {
      await testEngine.moveToLocation({
        location: treasureMountainAzuriteSeaIsland,
        character: card,
      });
    }

    await testEngine.passTurn();
    await testEngine.passTurn();

    await testEngine.resolveTopOfStack({
      targets: [treasureMountainAzuriteSeaIsland],
    });

    expect(
      testEngine.getCardModel(treasureMountainAzuriteSeaIsland).damage,
    ).toEqual(2);
  });
});
