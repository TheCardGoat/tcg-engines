/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hadesRuthlessTyrant,
  megaraPartOfThePlan,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Megara - Part of the Plan", () => {
  it("CONTENTIOUS ALLIANCE While you have a character named Hades in play, this character gains Challenger +2. (They get +2 {S} while challenging.)", async () => {
    const testEngine = new TestEngine({
      inkwell: hadesRuthlessTyrant.cost,
      play: [megaraPartOfThePlan],
      hand: [hadesRuthlessTyrant],
    });

    expect(testEngine.getCardModel(megaraPartOfThePlan).hasChallenger).toBe(
      false,
    );
    await testEngine.playCard(hadesRuthlessTyrant);
    expect(testEngine.getCardModel(megaraPartOfThePlan).hasChallenger).toBe(
      true,
    );
  });
});
