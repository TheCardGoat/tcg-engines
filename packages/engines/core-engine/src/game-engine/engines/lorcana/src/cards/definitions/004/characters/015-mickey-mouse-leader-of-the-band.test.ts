/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mickeyMouseLeaderOfTheBand,
  princeEricSeafaringPrince,
  ursulaVanessa,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Leader of the Band", () => {
  it("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: mickeyMouseLeaderOfTheBand.cost,
      play: [mickeyMouseLeaderOfTheBand, ursulaVanessa],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseLeaderOfTheBand);
    const target = testEngine.getCardModel(ursulaVanessa);

    expect(cardUnderTest.hasAbility("support")).toBe(true);
    cardUnderTest.quest();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] }, true);

    expect(target.strength).toBe(3);
  });
  it("When you play this character, chosen character gains **Support ** this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: mickeyMouseLeaderOfTheBand.cost,
      play: [ursulaVanessa, princeEricSeafaringPrince],
      hand: [mickeyMouseLeaderOfTheBand],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseLeaderOfTheBand);
    const target = testEngine.getCardModel(ursulaVanessa);
    const target2 = testEngine.getCardModel(princeEricSeafaringPrince);

    cardUnderTest.playFromHand();
    await testEngine.resolveTopOfStack({ targets: [target] }, true);
    expect(target.hasAbility("support")).toBe(true);

    target.quest();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target2] }, true);

    expect(target2.strength).toBe(4);
  });
});
