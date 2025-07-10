/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  calhounBattletested,
  elsaTrustedSister,
  madamMimCheatingSpellcaster,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Calhoun - Battle-Tested", () => {
  it("TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: calhounBattletested.cost,
        hand: [calhounBattletested, elsaTrustedSister],
      },
      {
        play: [madamMimCheatingSpellcaster],
      },
    );

    await testEngine.playCard(calhounBattletested);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [elsaTrustedSister] }, true);
    await testEngine.resolveTopOfStack({
      targets: [madamMimCheatingSpellcaster],
    });

    expect(testEngine.getCardModel(elsaTrustedSister).zone).toBe("discard");
    expect(testEngine.getCardModel(madamMimCheatingSpellcaster).strength).toBe(
      madamMimCheatingSpellcaster.strength - 3,
    );
  });
});
