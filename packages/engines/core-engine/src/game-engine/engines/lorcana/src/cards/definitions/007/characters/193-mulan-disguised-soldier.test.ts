/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mulanDisguisedSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Mulan - Disguised Soldier", () => {
  it.skip("WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: mulanDisguisedSoldier.cost,
      hand: [mulanDisguisedSoldier],
    });

    await testEngine.playCard(mulanDisguisedSoldier);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
