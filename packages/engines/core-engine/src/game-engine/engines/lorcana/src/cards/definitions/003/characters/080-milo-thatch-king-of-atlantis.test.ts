/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { miloThatchKingOfAtlantis } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Milo Thatch - King of Atlantis", () => {
  it.skip("**Shift** 4 _(You may pay 4 ink to play this on top of one of your characters named Milo Thatch.)_**TAKE THEM BY SURPRISE** When this character is banished, return all opposing characters to their players’ hands.", () => {
    const testStore = new TestStore({
      play: [miloThatchKingOfAtlantis],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      miloThatchKingOfAtlantis.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
