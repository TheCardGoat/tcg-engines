/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  deweyLovableShowoff,
  louisEndearingAlligator,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Louis - Endearing Alligator", () => {
  it("SENSITIVE SOUL This character enters play exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: louisEndearingAlligator.cost,
      hand: [louisEndearingAlligator],
    });

    const cardUnderTest = testEngine.getCardModel(louisEndearingAlligator);

    await testEngine.playCard(cardUnderTest);

    expect(cardUnderTest.exerted).toEqual(true);
  });

  it("FRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: louisEndearingAlligator.cost,
        hand: [louisEndearingAlligator],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(louisEndearingAlligator);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.hasReckless).toEqual(false);

    await testEngine.passTurn();

    expect(target.hasReckless).toEqual(true);
  });
});
