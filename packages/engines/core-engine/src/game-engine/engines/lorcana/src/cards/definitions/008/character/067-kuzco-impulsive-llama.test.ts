import { describe, expect, it } from "bun:test";
import {
  deweyLovableShowoff,
  kuzcoImpulsiveLlama,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kuzco - Impulsive Llama", () => {
  it("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Kuzco.)", async () => {
    const testEngine = new TestEngine({
      play: [kuzcoImpulsiveLlama],
    });

    const cardUnderTest = testEngine.getCardModel(kuzcoImpulsiveLlama);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("WHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: kuzcoImpulsiveLlama.cost,
        hand: [kuzcoImpulsiveLlama],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(kuzcoImpulsiveLlama);
    const target = testEngine.getCardModel(deweyLovableShowoff);
    expect(testEngine.getCardsByZone("hand", "player_two").length).toEqual(0);

    await testEngine.playCard(cardUnderTest);

    await testEngine.changeActivePlayer("player_two");

    await testEngine.resolveTopOfStack({ targets: [target] });
    // await testEngine.acceptOptionalLayer();

    expect(testEngine.getCardsByZone("hand", "player_two").length).toEqual(1);
  });
});
