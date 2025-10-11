import { describe, it } from "bun:test";
import { mulanDisguisedSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
