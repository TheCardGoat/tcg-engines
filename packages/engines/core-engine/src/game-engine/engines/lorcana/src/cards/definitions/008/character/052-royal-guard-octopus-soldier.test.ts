/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  druunRavenousPlague,
  royalGuardOctopusSoldier,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Royal Guard - Octopus Soldier", () => {
  it("HEAVILY ARMED Every time you draw a card, this character gains Challenger +1 for this turn. (Gains +1 {S} while challenging.)", async () => {
    const testEngine = new TestEngine(
      {
        play: [royalGuardOctopusSoldier],
      },
      {
        play: [druunRavenousPlague],
      },
    );

    const underTest = testEngine.getCardModel(royalGuardOctopusSoldier);
    const oppoChar = testEngine.getCardModel(druunRavenousPlague);

    oppoChar.exert();

    await testEngine.drawCard();

    expect(testEngine.getCardsByZone("hand").length).toBe(1);

    underTest.challenge(oppoChar);

    expect(oppoChar.damage).toBe(underTest.strength + 1);
  });
});
