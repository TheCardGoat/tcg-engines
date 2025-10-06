/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  amethystChromicon,
  retrosphere,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

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
