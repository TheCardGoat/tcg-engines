/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { billyBonesSpaceSailor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
