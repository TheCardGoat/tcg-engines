/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { wildcatsWrench } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import { forbiddenMountainMaleficentsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wildcat’s Wrench", () => {
  it("**REBUILD** {E} – Remove up to 2 damage from chosen location.", () => {
    const testStore = new TestStore({
      play: [wildcatsWrench, forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", wildcatsWrench.id);
    const targetLocation = testStore.getByZoneAndId(
      "play",
      forbiddenMountainMaleficentsCastle.id,
    );

    targetLocation.updateCardMeta({ damage: 2 });
    expect(targetLocation.damage).toBe(2);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [targetLocation] });

    expect(targetLocation.damage).toBe(0);
    expect(cardUnderTest.meta.exerted).toBe(true);
  });
});
