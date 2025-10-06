/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  billTheLizardChimneySweep,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bill The Lizard - Chimney Sweep", () => {
  it("NOTHING TO IT While another character in play has damage, this character gains Evasive. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      play: [billTheLizardChimneySweep, deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(billTheLizardChimneySweep);
    const otherCard = testEngine.getCardModel(deweyLovableShowoff);

    expect(cardUnderTest.hasEvasive).toBe(false);

    await testEngine.setCardDamage(otherCard, 1);

    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
