/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { naniProtectiveSister } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Nani - Protective Sister", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [naniProtectiveSister],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      naniProtectiveSister.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
