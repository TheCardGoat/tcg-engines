/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jumboPop } from "@lorcanito/lorcana-engine/cards/006/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Jumbo Pop", () => {
  it.skip("HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: jumboPop.cost,
      play: [jumboPop],
      hand: [jumboPop],
    });

    await testEngine.playCard(jumboPop);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
