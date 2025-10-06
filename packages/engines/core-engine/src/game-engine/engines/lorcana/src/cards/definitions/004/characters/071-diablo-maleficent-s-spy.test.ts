/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  mickeyBraveLittleTailor,
  mickeyMouseArtfulRogue,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { diabloMaleficentsSpy } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Diablo - Maleficent's Spy", () => {
  it("**SCOUT AHEAD** When you play this character, you may look at each opponent's hand.", () => {
    const testStore = new TestStore(
      {
        inkwell: diabloMaleficentsSpy.cost,
        hand: [diabloMaleficentsSpy],
      },
      {
        hand: [
          mickeyBraveLittleTailor,
          mickeyMouseArtfulRogue,
          mickeyMouseTrueFriend,
        ],
      },
    );

    const cardUnderTest = testStore.getCard(diabloMaleficentsSpy);
    cardUnderTest.playFromHand();
    // testStore.resolveOptionalAbility(true);

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

    targets.forEach((card) => {
      expect(card.meta.revealed).toEqual(true);
    });
  });
});
