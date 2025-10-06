/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { gadgetHackwrenchCreativeThinker } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

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
