import { describe, expect, it } from "bun:test";
import {
  deweyLovableShowoff,
  mushuFasttalkingDragon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
