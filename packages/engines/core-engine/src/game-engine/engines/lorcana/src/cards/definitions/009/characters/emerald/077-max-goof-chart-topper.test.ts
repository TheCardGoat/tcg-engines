import { describe, expect, it } from "bun:test";
import { thisIsMyFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  charlotteLaBouffMardiGrasPrincess,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { maxGoofChartTopper } from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Max Goof - Chart Topper", () => {
  it("Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Max Goof.)", async () => {
    const testEngine = new TestEngine({
      play: [maxGoofChartTopper],
    });

    const cardUnderTest = testEngine.getCardModel(maxGoofChartTopper);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("NUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.", async () => {
    const testEngine = new TestEngine({
      play: [maxGoofChartTopper],
      discard: [thisIsMyFamily],
      deck: [deweyLovableShowoff, charlotteLaBouffMardiGrasPrincess],
    });

    const cardUnderTest = testEngine.getCardModel(maxGoofChartTopper);
    const targetCard = testEngine.getCardModel(thisIsMyFamily);

    expect(testEngine.getCardsByZone("deck").length).toBe(2);
    expect(testEngine.getCardsByZone("discard").length).toBe(1);

    await testEngine.questCard(cardUnderTest);
    expect(testEngine.getPlayerLore()).toBe(2);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [targetCard] }, true);
    await testEngine.resolveTopOfStack({});

    // This is my Family draws you a card, and give one lore
    expect(testEngine.getPlayerLore()).toBe(3);
    expect(testEngine.getCardsByZone("hand").length).toBe(1);

    // You initially had 2, you drew 1, and put the other on the bottom of your deck
    expect(testEngine.getCardsByZone("deck").length).toBe(2);
    expect(testEngine.getCardsByZone("discard").length).toBe(0);
  });
});
