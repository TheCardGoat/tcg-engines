/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  iagoLoudMouthedParrot,
  johnSilverAlienPirate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Iago Silver - Loud-Mouthed Parrot", () => {
  it("YOU GOT A PROBLEM? - {E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_", () => {
    const testStore = new TestStore(
      {
        deck: 2,
        inkwell: iagoLoudMouthedParrot.cost,
        play: [iagoLoudMouthedParrot],
      },
      {
        deck: 2,
        play: [johnSilverAlienPirate],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      iagoLoudMouthedParrot.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      johnSilverAlienPirate.id,
      "player_two",
    );

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    // Character gets "Reckless" on their turn
    expect(target.hasReckless).toBeFalsy();
    testStore.passTurn();
    expect(target.hasReckless).toBeTruthy();
  });
});
