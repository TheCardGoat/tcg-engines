import { describe, expect, it } from "bun:test";
import { miloThatchSpiritedScholar } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { forbiddenMountainMaleficentsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Milo Thatch - Spirited Scholar", () => {
  it("**I’M YOUR MAN!** While this character is at a location, he gets +2 {S}.", () => {
    const testStore = new TestStore({
      inkwell: miloThatchSpiritedScholar.cost,
      play: [miloThatchSpiritedScholar, forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getCard(miloThatchSpiritedScholar);
    const location = testStore.getCard(forbiddenMountainMaleficentsCastle);

    expect(cardUnderTest.strength).toEqual(miloThatchSpiritedScholar.strength);
    cardUnderTest.enterLocation(location);
    expect(cardUnderTest.strength).toEqual(
      miloThatchSpiritedScholar.strength + 2,
    );
  });
});
