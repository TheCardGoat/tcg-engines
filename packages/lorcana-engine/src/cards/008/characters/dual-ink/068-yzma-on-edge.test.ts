/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  mickeyMouseGiantMouse,
  pullTheLever,
  wrongLeverAction,
  yzmaOnEdge,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Yzma - On Edge", () => {
  it("WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: yzmaOnEdge.cost,
      hand: [yzmaOnEdge],
      discard: [pullTheLever],
      deck: [wrongLeverAction, mickeyMouseGiantMouse, mickeyBraveLittleTailor],
    });

    await testEngine.playCard(yzmaOnEdge);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({
      targets: [wrongLeverAction],
    });

    expect(testEngine.getCardModel(wrongLeverAction).zone).toBe("hand");
  });
});
