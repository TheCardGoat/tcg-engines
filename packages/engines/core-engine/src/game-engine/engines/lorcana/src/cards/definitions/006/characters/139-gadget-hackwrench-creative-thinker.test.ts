/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { gadgetHackwrenchCreativeThinker } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gadget Hackwrench - Creative Thinker", () => {
  it.skip("BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: gadgetHackwrenchCreativeThinker.cost,
      play: [gadgetHackwrenchCreativeThinker],
      hand: [gadgetHackwrenchCreativeThinker],
    });

    await testEngine.playCard(gadgetHackwrenchCreativeThinker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
