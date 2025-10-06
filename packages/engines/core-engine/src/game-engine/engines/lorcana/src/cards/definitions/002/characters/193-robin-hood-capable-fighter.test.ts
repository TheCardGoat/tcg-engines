/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  princeNaveenPennilessRoyal,
  robinHoodCapableFighter,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Robin Hood- Capable Fighter", () => {
  it("**SKIRMISH** {E} − Deal 1 damage to chosen character.", () => {
    const testStore = new TestStore({
      inkwell: robinHoodCapableFighter.cost,
      hand: [robinHoodCapableFighter],
      play: [princeNaveenPennilessRoyal],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      robinHoodCapableFighter.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      princeNaveenPennilessRoyal.id,
    );

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toEqual(1);
  });
});
