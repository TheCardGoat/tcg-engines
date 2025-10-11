/**
 * @jest-environment node
 */
import { describe, expect, it } from "bun:test";
import {
  megaraPullingTheStrings,
  mickeyMouseArtfulRogue,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Artful Rogue", () => {
  it("**MISDIRECTION** Whenever you play an action, chosen opposing character can't quest during their next turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: hakunaMatata.cost,
        hand: [hakunaMatata],
        play: [mickeyMouseArtfulRogue],
      },
      {
        play: [megaraPullingTheStrings],
      },
    );

    const actionCard = testStore.getByZoneAndId("hand", hakunaMatata.id);
    const target = testStore.getByZoneAndId(
      "play",
      megaraPullingTheStrings.id,
      "player_two",
    );

    actionCard.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.hasQuestRestriction).toEqual(true);
  });

  it("Shift", () => {
    const testStore = new TestStore({
      play: [mickeyMouseArtfulRogue],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mickeyMouseArtfulRogue.id,
    );

    expect(cardUnderTest.hasShift).toEqual(true);
  });
});
