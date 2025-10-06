/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { perplexingSignposts } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";

describe("Perplexing Signposts", () => {
  it("**TO WONDERLAND** Banish this item – Return chosen character of yours to your hand.", () => {
    const testStore = new TestStore({
      play: [perplexingSignposts, liloGalacticHero],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      perplexingSignposts.id,
    );
    const target = testStore.getByZoneAndId("play", liloGalacticHero.id);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(cardUnderTest.zone).toEqual("discard");
    expect(target.zone).toEqual("hand");
  });
});
