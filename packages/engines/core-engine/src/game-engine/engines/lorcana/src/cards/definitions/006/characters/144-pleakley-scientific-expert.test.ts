/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { pleakleyScientificExpert } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pleakley - Scientific Expert", () => {
  it.skip("REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: pleakleyScientificExpert.cost,
      hand: [pleakleyScientificExpert],
    });

    await testEngine.playCard(pleakleyScientificExpert);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
