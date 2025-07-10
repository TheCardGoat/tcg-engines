/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  generalLiHeadOfTheImperialArmy,
  jumbaJookibaCriticalScientist,
  theyNeverComeBack,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
