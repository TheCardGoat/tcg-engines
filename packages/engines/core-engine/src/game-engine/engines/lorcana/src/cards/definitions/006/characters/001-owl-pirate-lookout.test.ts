/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { owlPirateLookout } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

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
