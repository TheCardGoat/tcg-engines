import { describe, expect, it } from "bun:test";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { familyFishingPole } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Family Fishing Pole", () => {
  it("WATCH CLOSELY This item enters play exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: familyFishingPole.cost,
      hand: [familyFishingPole],
    });

    const cardUnderTest = testEngine.getCardModel(familyFishingPole);

    await testEngine.playCard(cardUnderTest);

    expect(cardUnderTest.exerted).toBe(true);
  });

  it("THE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: 1,
      play: [familyFishingPole, deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(familyFishingPole);
    const targetCard = testEngine.getCardModel(deweyLovableShowoff);
    targetCard.exert();

    // await testEngine.activateCard(cardUnderTest);

    cardUnderTest.activate("THE PERFECT CAST");

    // await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(cardUnderTest.zone).toBe("discard");
    expect(targetCard.zone).toBe("hand");
    expect(testEngine.getPlayerLore()).toBe(2);
  });
});
