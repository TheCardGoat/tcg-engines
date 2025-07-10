/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  deweyLovableShowoff,
  mushuFasttalkingDragon,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Mushu - Fast-Talking Dragon", () => {
  it("LET’S GET THIS SHOW ON THE ROAD {E} – Chosen character gains Rush this turn. (They can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [mushuFasttalkingDragon, deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(mushuFasttalkingDragon);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.activateCard(cardUnderTest, {
      targets: [target],
    });

    expect(target.hasRush).toBe(true);
  });
});
