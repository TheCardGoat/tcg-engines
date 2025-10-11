import { describe, expect, it } from "bun:test";
import { kidaProtectorOfAtlantis } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { vincenzoSantoriniTheExplosivesExpert } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Vincenzo Santorini - The Explosives Expert", () => {
  it("I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: vincenzoSantoriniTheExplosivesExpert.cost,
        hand: [vincenzoSantoriniTheExplosivesExpert],
      },
      {
        inkwell: 0,
        play: [kidaProtectorOfAtlantis],
      },
    );

    await testEngine.playCard(vincenzoSantoriniTheExplosivesExpert);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [kidaProtectorOfAtlantis] });
    expect(testEngine.getCardModel(kidaProtectorOfAtlantis).damage).toBe(3);
  });
});
