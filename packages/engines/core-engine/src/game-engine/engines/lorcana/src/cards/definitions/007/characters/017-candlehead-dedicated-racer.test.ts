/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { candleheadDedicatedRacer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Candlehead - Dedicated Racer", () => {
  it.skip("WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: candleheadDedicatedRacer.cost,
      play: [candleheadDedicatedRacer],
      hand: [candleheadDedicatedRacer],
    });

    await testEngine.playCard(candleheadDedicatedRacer);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
