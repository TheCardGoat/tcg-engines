/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { magicBroomTheBigSweeper } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { theSorcerersTowerWondrousWorkspace } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Sorcerer's Tower - Wondrous Workspace", () => {
  it("**BROOM CLOSET** Your characters named Magic Broom may move here for free.", () => {
    const testStore = new TestStore({
      play: [
        theSorcerersTowerWondrousWorkspace,
        magicBroomBucketBrigade,
        magicBroomTheBigSweeper,
      ],
    });

    const cardUnderTest = testStore.getCard(theSorcerersTowerWondrousWorkspace);

    const magicBroomBucketBrigadeCard = testStore.getCard(
      magicBroomBucketBrigade,
    );
    const magicBroomTheBigSweeperCard = testStore.getCard(
      magicBroomTheBigSweeper,
    );

    magicBroomBucketBrigadeCard.enterLocation(cardUnderTest);
    magicBroomTheBigSweeperCard.enterLocation(cardUnderTest);

    expect(magicBroomBucketBrigadeCard.isAtLocation(cardUnderTest)).toBe(true);
    expect(magicBroomTheBigSweeperCard.isAtLocation(cardUnderTest)).toBe(true);
    expect(cardUnderTest.containsCharacter(magicBroomBucketBrigadeCard)).toBe(
      true,
    );
    expect(cardUnderTest.containsCharacter(magicBroomTheBigSweeperCard)).toBe(
      true,
    );
  });

  it.skip("**MAGICAL POWER** Characters get +1 {L} while here.", () => {
    const testStore = new TestStore({
      inkwell: theSorcerersTowerWondrousWorkspace.cost,
      play: [theSorcerersTowerWondrousWorkspace],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theSorcerersTowerWondrousWorkspace.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
