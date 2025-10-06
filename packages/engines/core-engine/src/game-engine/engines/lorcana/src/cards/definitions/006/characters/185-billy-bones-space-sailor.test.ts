/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { billyBonesSpaceSailor } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Billy Bones - Space Sailor", () => {
  it.skip("KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.", async () => {
    const testEngine = new TestEngine({
      inkwell: billyBonesSpaceSailor.cost,
      play: [billyBonesSpaceSailor],
      hand: [billyBonesSpaceSailor],
    });

    await testEngine.playCard(billyBonesSpaceSailor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
