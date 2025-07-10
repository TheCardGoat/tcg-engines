/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { owlPirateLookout } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
