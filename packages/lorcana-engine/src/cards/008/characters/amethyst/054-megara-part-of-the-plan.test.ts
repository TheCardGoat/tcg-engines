/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hadesRuthlessTyrant,
  megaraPartOfThePlan,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
