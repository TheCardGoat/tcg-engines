/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/169-pawpsicle";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { aliceAccidentallyAdrift } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Alice - Accidentally Adrift", () => {
  it("WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: aliceAccidentallyAdrift.cost,
      hand: [aliceAccidentallyAdrift],
      play: [pawpsicle],
    });

    const cardUnderTest = testEngine.getCardModel(aliceAccidentallyAdrift);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("inkwell");
  });

  it("MAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.", async () => {
    const testEngine = new TestEngine(
      {
        play: [aliceAccidentallyAdrift],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(aliceAccidentallyAdrift);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.questCard(cardUnderTest);
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toEqual(deweyLovableShowoff.strength - 2);
  });
});
