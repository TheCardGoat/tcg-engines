import { describe, expect, it } from "bun:test";
import { stichtNewDog } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { atlanticaConcertHall } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
