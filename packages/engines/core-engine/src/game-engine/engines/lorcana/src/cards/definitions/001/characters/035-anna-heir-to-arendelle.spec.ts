/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  annaHeirToArendelle,
  elsaQueenRegent,
  timonGrubRustler,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Anna - Heir to Arendelle", () => {
  describe("**LOVING HEART** When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.", () => {
    it("No Elsa in play", () => {
      const testStore = new TestStore(
        {
          inkwell: annaHeirToArendelle.cost,
          hand: [annaHeirToArendelle],
        },
        {
          play: [timonGrubRustler],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        annaHeirToArendelle.id,
      );
      cardUnderTest.playFromHand();

      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("With Elsa in play", () => {
      const testStore = new TestStore(
        {
          inkwell: annaHeirToArendelle.cost,
          hand: [annaHeirToArendelle],
          play: [elsaQueenRegent],
        },
        {
          play: [timonGrubRustler],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        annaHeirToArendelle.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        timonGrubRustler.id,
        "player_two",
      );
      cardUnderTest.playFromHand();

      expect(testStore.stackLayers).toHaveLength(1);
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.hasExertRestriction).toEqual(true);
    });
  });
});
