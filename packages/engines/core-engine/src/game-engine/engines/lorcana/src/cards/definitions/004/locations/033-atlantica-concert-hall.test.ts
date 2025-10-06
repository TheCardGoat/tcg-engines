/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { stichtNewDog } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { atlanticaConcertHall } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/locations";

describe("Atlantica - Concert Hall", () => {
  it("Underwater Acoustics - Characters count as having +2 cost to sing songs while here.", async () => {
    const testEngine = new TestEngine({
      inkwell: atlanticaConcertHall.moveCost,
      play: [atlanticaConcertHall, stichtNewDog],
    });

    const { location, character } = await testEngine.moveToLocation({
      character: stichtNewDog,
      location: atlanticaConcertHall,
    });

    expect(character.singerCost).toBe(2 + stichtNewDog.cost);
  });
});
