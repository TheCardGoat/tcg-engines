/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tadashiHamadaBaymaxInventor } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Tadashi Hamada - Baymax Inventor", () => {
  it.skip("LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.", async () => {
    const testEngine = new TestEngine({
      inkwell: tadashiHamadaBaymaxInventor.cost,
      play: [tadashiHamadaBaymaxInventor],
      hand: [tadashiHamadaBaymaxInventor],
    });

    await testEngine.playCard(tadashiHamadaBaymaxInventor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
