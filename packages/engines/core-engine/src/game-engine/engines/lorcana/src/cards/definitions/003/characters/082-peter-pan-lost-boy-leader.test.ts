/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { peterPanLostBoyLeader } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  forbiddenMountainMaleficentsCastle,
  neverLandMermaidLagoon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Peter Pan - Lost Boy Leader", () => {
  it("**I CAME TO LISTEN TO THE STORIES** Once per turn, when this character moves to a location, gain lore equal to that location's {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell:
        forbiddenMountainMaleficentsCastle.moveCost +
        neverLandMermaidLagoon.moveCost,
      play: [
        peterPanLostBoyLeader,
        forbiddenMountainMaleficentsCastle,
        neverLandMermaidLagoon,
      ],
    });

    await testEngine.moveToLocation({
      character: peterPanLostBoyLeader,
      location: forbiddenMountainMaleficentsCastle,
    });

    expect(testEngine.getPlayerLore()).toBe(
      forbiddenMountainMaleficentsCastle.lore,
    );

    await testEngine.moveToLocation({
      character: peterPanLostBoyLeader,
      location: neverLandMermaidLagoon,
    });

    expect(testEngine.getPlayerLore()).toBe(
      forbiddenMountainMaleficentsCastle.lore,
    );
  });
});
