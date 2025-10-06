/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { dalmatianPuppyTailWagger } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dalmatian Puppy - Tail Wagger", () => {
  it.skip("WHERE DID THEY ALL COME FROM? You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: dalmatianPuppyTailWagger.cost,
      play: [dalmatianPuppyTailWagger],
      hand: [dalmatianPuppyTailWagger],
    });

    await testEngine.playCard(dalmatianPuppyTailWagger);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
