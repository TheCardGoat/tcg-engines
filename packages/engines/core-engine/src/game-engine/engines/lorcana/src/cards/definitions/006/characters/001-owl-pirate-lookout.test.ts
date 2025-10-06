/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { owlPirateLookout } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Owl - Pirate Lookout", () => {
  it.skip("WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: owlPirateLookout.cost,
      play: [owlPirateLookout],
      hand: [owlPirateLookout],
    });

    await testEngine.playCard(owlPirateLookout);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
