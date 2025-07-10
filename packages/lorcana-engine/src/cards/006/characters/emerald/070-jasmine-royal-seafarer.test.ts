/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jasmineRoyalSeafarer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Jasmine - Royal Seafarer", () => {
  it.skip("BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
    const testEngine = new TestEngine({
      inkwell: jasmineRoyalSeafarer.cost,
      hand: [jasmineRoyalSeafarer],
    });

    await testEngine.playCard(jasmineRoyalSeafarer);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
