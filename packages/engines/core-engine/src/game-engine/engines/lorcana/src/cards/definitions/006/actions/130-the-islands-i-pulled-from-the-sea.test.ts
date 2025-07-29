import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { forbiddenMountainMaleficentsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import { theIslandsIPulledFromTheSea } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Islands I Pulled From The Sea", () => {
  it("Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [mickeyBraveLittleTailor],
      hand: [theIslandsIPulledFromTheSea],
      deck: [forbiddenMountainMaleficentsCastle],
    });

    await testEngine.playCard(theIslandsIPulledFromTheSea);
    await testEngine.resolveTopOfStack({
      targets: [forbiddenMountainMaleficentsCastle],
    });

    expect(
      testEngine.getCardModel(forbiddenMountainMaleficentsCastle).zone,
    ).toBe("hand");
  });
});
