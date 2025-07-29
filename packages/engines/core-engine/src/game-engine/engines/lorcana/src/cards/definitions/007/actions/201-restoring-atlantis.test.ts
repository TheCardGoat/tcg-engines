import { describe, expect, it } from "bun:test";
import {
  anastasiaBossyStepsister,
  elsaTrustedSister,
  mufasaRespectedKing,
  restoringAtlantis,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Restoring Atlantis", () => {
  it("Your characters can't be challenged until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: restoringAtlantis.cost,
        play: [anastasiaBossyStepsister, elsaTrustedSister],
        hand: [restoringAtlantis],
      },
      {
        deck: 3,
        play: [mufasaRespectedKing],
      },
    );

    await testEngine.playCard(restoringAtlantis);

    await testEngine.passTurn();

    await testEngine.tapCard(anastasiaBossyStepsister);
    await testEngine.tapCard(elsaTrustedSister);

    const attacker = testEngine.getCardModel(mufasaRespectedKing);
    expect(
      attacker.canChallenge(testEngine.getCardModel(anastasiaBossyStepsister)),
    ).toBe(false);
    expect(
      attacker.canChallenge(testEngine.getCardModel(elsaTrustedSister)),
    ).toBe(false);
  });
});
