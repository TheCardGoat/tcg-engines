/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  amethystChromicon,
  retrosphere,
} from "@lorcanito/lorcana-engine/cards/005/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Retrosphere", () => {
  it("**EXTRACT OF AMETHYST** 2 {I}, Banish this item – Return chosen character, item, or location with cost 3 or less to their player’s hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: 2,
      play: [retrosphere, amethystChromicon],
    });

    const cardUnderTest = await testEngine.activateCard(retrosphere);

    await testEngine.resolveTopOfStack({ targets: [amethystChromicon] });

    expect(cardUnderTest.zone).toEqual("discard");
    expect(testEngine.getCardModel(amethystChromicon).zone).toEqual("hand");
  });
});
