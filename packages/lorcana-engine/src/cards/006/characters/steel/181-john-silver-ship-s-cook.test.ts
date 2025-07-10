/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { johnSilverShipsCook } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("John Silver - Ship's Cook", () => {
  it.skip("HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: johnSilverShipsCook.cost,
      hand: [johnSilverShipsCook],
    });

    await testEngine.playCard(johnSilverShipsCook);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
