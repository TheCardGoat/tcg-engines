/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { flotillaCoconutArmada } from "~/game-engine/engines/lorcana/src/cards/definitions/006/locations/locations";

describe("Flotilla - Coconut Armada", () => {
  it.skip("TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.", async () => {
    const testEngine = new TestEngine({
      inkwell: flotillaCoconutArmada.cost,
      play: [flotillaCoconutArmada],
      hand: [flotillaCoconutArmada],
    });

    await testEngine.playCard(flotillaCoconutArmada);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
