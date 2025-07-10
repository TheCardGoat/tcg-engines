/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  deweyLovableShowoff,
  trampObservantGuardian,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Tramp - Observant Guardian", () => {
  it("HOW DO I GET IN? When you play this character, chosen character gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)", async () => {
    const testEngine = new TestEngine({
      inkwell: trampObservantGuardian.cost,
      hand: [trampObservantGuardian],
      play: [deweyLovableShowoff],
    });

    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.playCard(trampObservantGuardian);
    // await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.hasWard).toBe(true);

    testEngine.passTurn();

    expect(target.hasWard).toBe(true);

    testEngine.passTurn();

    expect(target.hasWard).toBe(false);
  });
});
