/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  aladdinVigilantGuard,
  jasmineResourcefulInfiltrator,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Jasmine - Resourceful Infiltrator", () => {
  it("JUST WHAT YOU NEED When you play this character, you may give another chosen character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: jasmineResourcefulInfiltrator.cost,
      hand: [jasmineResourcefulInfiltrator],
      play: [aladdinVigilantGuard],
    });

    await testEngine.playCard(jasmineResourcefulInfiltrator);
    await testEngine.acceptOptionalAbility();
    await testEngine.resolveTopOfStack({
      targets: [aladdinVigilantGuard],
    });

    expect(testEngine.getCardModel(aladdinVigilantGuard).hasResist).toBe(true);
  });
});
