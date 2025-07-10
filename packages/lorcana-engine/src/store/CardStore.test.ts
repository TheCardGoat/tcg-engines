/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  annaHeirToArendelle,
  elsaQueenRegent,
  timonGrubRustler,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("CardStore", () => {
  describe("Card Filter", () => {
    test("Complex Name Filter", () => {
      const testStore = new TestStore({
        hand: [annaHeirToArendelle],
        play: [elsaQueenRegent],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        annaHeirToArendelle.id,
      );
      const result = testStore.store.cardStore.getCardsByTargetFilter(
        [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Elsa" },
          },
        ],
        "player_one",
        cardUnderTest,
      );

      expect(result).toHaveLength(1);
    });
  });
});
