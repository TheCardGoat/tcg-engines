/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mirabelMadrigalMusicallyTalented,
  soMuchToGive,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Mirabel Madrigal - Musically Talented", () => {
  it("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)", async () => {
    const testEngine = new TestEngine({
      play: [mirabelMadrigalMusicallyTalented],
    });

    const cardUnderTest = testEngine.getCardModel(
      mirabelMadrigalMusicallyTalented,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("HER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      play: [mirabelMadrigalMusicallyTalented],
      discard: [soMuchToGive],
    });

    await testEngine.questCard(mirabelMadrigalMusicallyTalented);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [soMuchToGive] });

    expect(testEngine.getCardModel(soMuchToGive).zone).toBe("hand");
  });
});
