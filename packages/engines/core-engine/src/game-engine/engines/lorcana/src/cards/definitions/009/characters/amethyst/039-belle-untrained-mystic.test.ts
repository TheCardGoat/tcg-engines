/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { belleUntrainedMystic } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Belle - Untrained Mystic", () => {
  it.skip("**HERE NOW, DON'T DO THAT** When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: belleUntrainedMystic.cost,
      hand: [belleUntrainedMystic],
    });

    await testEngine.playCard(belleUntrainedMystic);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
