/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  buckyNuttyRascal,
  wreckitRalphHerosDuty,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bucky - Nutty Rascal", () => {
  it("POP! When this character is banished in a challenge, you may draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        deck: 10,
        play: [buckyNuttyRascal],
      },
      {
        play: [wreckitRalphHerosDuty],
      },
    );

    await testEngine.challenge({
      attacker: buckyNuttyRascal,
      defender: wreckitRalphHerosDuty,
      exertDefender: true,
    });

    await testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
