/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mickeyBraveLittleTailor,
  mickeyMouseArtfulRogue,
  mickeyMouseTrueFriend,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { nothingToHide } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Nothing to Hide", () => {
  it("Each opponent reveals their hand. Draw a card.", () => {
    const testStore = new TestStore(
      {
        inkwell: nothingToHide.cost,
        hand: [nothingToHide],
        deck: 2,
      },
      {
        hand: [
          mickeyBraveLittleTailor,
          mickeyMouseArtfulRogue,
          mickeyMouseTrueFriend,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", nothingToHide.id);
    const targets = [
      testStore.getByZoneAndId(
        "hand",
        mickeyBraveLittleTailor.id,
        "player_two",
      ),
      testStore.getByZoneAndId("hand", mickeyMouseArtfulRogue.id, "player_two"),
      testStore.getByZoneAndId("hand", mickeyMouseTrueFriend.id, "player_two"),
    ];

    cardUnderTest.playFromHand();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 1,
        hand: 1,
      }),
    );
    targets.forEach((card) => {
      expect(card.meta.revealed).toEqual(true);
    });
  });
});
