import { describe, expect, it } from "bun:test";
import {
  generalLiHeadOfTheImperialArmy,
  jumbaJookibaCriticalScientist,
  theyNeverComeBack,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("They Never Come Back", () => {
  it("Up to 2 chosen characters can’t ready at the start of their next turn. Draw a card.", async () => {
    const targets = [
      jumbaJookibaCriticalScientist,
      generalLiHeadOfTheImperialArmy,
    ];

    const testEngine = new TestEngine(
      {
        inkwell: theyNeverComeBack.cost,
        hand: [theyNeverComeBack],
        deck: 10,
      },
      {
        play: targets,
      },
    );

    for (const target of targets) {
      await testEngine.tapCard(target);
    }

    await testEngine.playCard(theyNeverComeBack, {
      targets: targets,
    });

    for (const target of targets) {
      expect(testEngine.getCardModel(target).exerted).toBe(true);
    }
  });
});
