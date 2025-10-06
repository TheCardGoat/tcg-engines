/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  deweyLovableShowoff,
  khanWarHorse,
  theCoachmanGreedyDeceiver,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("The Coachman - Greedy Deceiver", () => {
  it("RECKLESS RUN While you have 2 or more characters exerted, this character gets +2 {S} and Evasive.", async () => {
    const testEngine = new TestEngine({
      play: [theCoachmanGreedyDeceiver, deweyLovableShowoff, khanWarHorse],
    });

    await testEngine.tapCard(deweyLovableShowoff);

    expect(
      testEngine.getCardModel(theCoachmanGreedyDeceiver).hasEvasive,
    ).toEqual(false);
    expect(testEngine.getCardModel(theCoachmanGreedyDeceiver).strength).toEqual(
      theCoachmanGreedyDeceiver.strength,
    );

    await testEngine.tapCard(khanWarHorse);

    expect(
      testEngine.getCardModel(theCoachmanGreedyDeceiver).hasEvasive,
    ).toEqual(true);
    expect(testEngine.getCardModel(theCoachmanGreedyDeceiver).strength).toEqual(
      theCoachmanGreedyDeceiver.strength + 2,
    );
  });
});
