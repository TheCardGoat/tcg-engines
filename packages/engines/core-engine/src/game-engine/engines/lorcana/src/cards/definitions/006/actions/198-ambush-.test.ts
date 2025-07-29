import { describe, expect, it } from "bun:test";
import {
  ambush,
  mammaOdieLoneSage,
  owlPirateLookout,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ambush!", () => {
  it("{E} one of your characters to deal damage equal to their {S} to chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: ambush.cost,
        play: [owlPirateLookout],
        hand: [ambush],
      },
      {
        play: [mammaOdieLoneSage],
      },
    );

    await testEngine.playCard(ambush);

    await testEngine.resolveTopOfStack({ targets: [owlPirateLookout] }, true);
    expect(testEngine.getCardModel(owlPirateLookout).exerted).toBe(true);

    await testEngine.resolveTopOfStack({ targets: [mammaOdieLoneSage] });
    expect(testEngine.getCardModel(mammaOdieLoneSage).damage).toBe(
      owlPirateLookout.strength,
    );
  });
});
