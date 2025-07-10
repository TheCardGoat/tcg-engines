/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import { theQueensCastleMirrorChamber } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Trigger Abilities", () => {
  it("Optional triggers shouldn't ask for action when there's no valid target", () => {
    const testStore = new TestStore(
      {},
      {
        play: [theQueensCastleMirrorChamber],
        deck: 5,
      },
    );

    testStore.passTurn();

    expect(testStore.stackLayers).toHaveLength(0);
  });
});
