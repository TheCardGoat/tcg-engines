/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { judyHoppsOptimisticOfficer } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Judy Hopps - Optimistic Officer", () => {
  it.skip("**DON'T CALL ME CUTE** When you play this character, you may banish chosen item. Its player draws a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: judyHoppsOptimisticOfficer.cost,
      hand: [judyHoppsOptimisticOfficer],
    });

    await testEngine.playCard(judyHoppsOptimisticOfficer);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
