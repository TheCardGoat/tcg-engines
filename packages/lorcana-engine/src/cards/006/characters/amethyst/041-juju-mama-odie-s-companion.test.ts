/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jujuMamaOdiesCompanion } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Juju - Mama Odie's Companion", () => {
  it.skip("BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: jujuMamaOdiesCompanion.cost,
      hand: [jujuMamaOdiesCompanion],
    });

    await testEngine.playCard(jujuMamaOdiesCompanion);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
