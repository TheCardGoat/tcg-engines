import { describe, expect, it } from "bun:test";
import { beastTragicHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { marchHareHareBrainedEccentric } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("March Hare - Hare-Brained Eccentric", () => {
  it("LIGHT THE CANDLES When you play this character, you may choose a character with one or more damage and deal 2 damage to it.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: marchHareHareBrainedEccentric.cost,
        hand: [marchHareHareBrainedEccentric],
      },
      {
        play: [beastTragicHero],
      },
    );

    const cardTarget = testEngine.getCardModel(beastTragicHero);
    expect(cardTarget.damage).toEqual(0);
    testEngine.setCardDamage(cardTarget, 1);

    await testEngine.playCard(marchHareHareBrainedEccentric);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [cardTarget] });

    expect(cardTarget.damage).toEqual(3);
  });
});
