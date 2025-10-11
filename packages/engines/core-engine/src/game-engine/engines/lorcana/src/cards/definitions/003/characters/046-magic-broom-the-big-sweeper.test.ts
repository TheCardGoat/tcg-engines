import { describe, expect, it } from "bun:test";
import { magicBroomTheBigSweeper } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { forbiddenMountainMaleficentsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import { aladdinResoluteSwordsman } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magic Broom - The Big Sweeper", () => {
  it("**CLEAN SWEEP** While this character is at a location, it gets +2 {S}.", () => {
    const testStore = new TestStore({
      inkwell: magicBroomTheBigSweeper.cost,
      play: [
        magicBroomTheBigSweeper,
        forbiddenMountainMaleficentsCastle,
        aladdinResoluteSwordsman,
      ],
    });

    const cardUnderTest = testStore.getCard(magicBroomTheBigSweeper);
    const location = testStore.getCard(forbiddenMountainMaleficentsCastle);
    const anotherCard = testStore.getCard(aladdinResoluteSwordsman);

    expect(cardUnderTest.strength).toEqual(magicBroomTheBigSweeper.strength);
    expect(anotherCard.strength).toEqual(aladdinResoluteSwordsman.strength);
    cardUnderTest.enterLocation(location);
    expect(anotherCard.strength).toEqual(aladdinResoluteSwordsman.strength);

    expect(cardUnderTest.strength).toEqual(
      magicBroomTheBigSweeper.strength + 2,
    );
  });
});
