/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { agustinMadrigalClumsyDad } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { kuzcoBoredRoyal } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Kuzco - Bored Royal", () => {
  it("LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: kuzcoBoredRoyal.cost,
        hand: [kuzcoBoredRoyal],
      },
      {
        play: [agustinMadrigalClumsyDad],
      },
    );

    const cardUnderTest = testEngine.getCardModel(kuzcoBoredRoyal);
    const targetCard = testEngine.getCardModel(agustinMadrigalClumsyDad);

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(targetCard.zone).toEqual("hand");
  });
});
