import { describe, expect, it } from "bun:test";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { circleOfLife } from "./026-circle-of-life";

describe("Circle Of Life", () => {
  it.skip("Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: circleOfLife.cost,
      play: [circleOfLife],
      hand: [circleOfLife],
    });

    await testEngine.playCard(circleOfLife);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it("Play a character from your discard for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: circleOfLife.cost,
      discard: [deweyLovableShowoff],
      hand: [circleOfLife],
    });

    const targetCard = testEngine.getCardModel(deweyLovableShowoff);
    const cardUnderTest = testEngine.getCardModel(circleOfLife);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(targetCard.zone).toEqual("play");
  });
});
