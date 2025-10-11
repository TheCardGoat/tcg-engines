import { describe, expect, it } from "bun:test";
import {
  calhounBattletested,
  elsaTrustedSister,
  madamMimCheatingSpellcaster,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
