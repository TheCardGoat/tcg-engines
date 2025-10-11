import { describe, expect, it } from "bun:test";
import {
  lafayetteSleepyDachshund,
  olafRecappingTheStory,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Olaf - Recapping the Story", () => {
  it("ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: olafRecappingTheStory.cost,
        hand: [olafRecappingTheStory],
      },
      {
        play: [lafayetteSleepyDachshund],
      },
    );

    const lafayette = testEngine.getCardModel(lafayetteSleepyDachshund);

    await testEngine.playCard(olafRecappingTheStory);
    await testEngine.resolveTopOfStack({ targets: [lafayette] });

    expect(lafayette.strength).toBe(lafayetteSleepyDachshund.strength - 1);
    testEngine.passTurn();
    expect(lafayette.strength).toBe(lafayetteSleepyDachshund.strength);
  });
});
