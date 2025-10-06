/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  bashfulHopelessRomantic,
  docLeaderOfTheSevenDwarfs,
  grumpyBadTempered,
  sleepyNoddingOff,
  snowWhiteUnexpectedHouseGuest,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Snow White - Unexpected Househuest", () => {
  it("**HOW DO YOU DO?** You pay 1 {I} less to play Seven Dwarfs characters.", () => {
    const testStore = new TestStore({
      inkwell:
        grumpyBadTempered.cost +
        docLeaderOfTheSevenDwarfs.cost +
        sleepyNoddingOff.cost +
        bashfulHopelessRomantic.cost -
        4,
      hand: [
        grumpyBadTempered,
        docLeaderOfTheSevenDwarfs,
        sleepyNoddingOff,
        bashfulHopelessRomantic,
      ],
      play: [snowWhiteUnexpectedHouseGuest],
    });

    const target0 = testStore.getByZoneAndId("hand", grumpyBadTempered.id);
    const target1 = testStore.getByZoneAndId(
      "hand",
      docLeaderOfTheSevenDwarfs.id,
    );
    const target2 = testStore.getByZoneAndId("hand", sleepyNoddingOff.id);
    const target3 = testStore.getByZoneAndId(
      "hand",
      bashfulHopelessRomantic.id,
    );

    [target0, target1, target2, target3].forEach((card) => {
      expect(card.zone).toEqual("hand");
      card.playFromHand();
      expect(card.zone).toEqual("play");
    });
  });
});
