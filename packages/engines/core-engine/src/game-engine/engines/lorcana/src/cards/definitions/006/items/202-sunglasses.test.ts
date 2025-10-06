/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { sunglasses } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/items";

describe("Sunglasses", () => {
  it.skip("SPYCRAFT {E} - Draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: sunglasses.cost,
      play: [sunglasses],
      hand: [sunglasses],
    });

    await testEngine.playCard(sunglasses);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
