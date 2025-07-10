/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  elsaSpiritOfWinter,
  johnSilverAlienPirate,
  pascalRapunzelCompanion,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

export function elsaSpiritOfWinterTargetingOneCharacterTestCase() {
  const testStore = new TestStore(
    {
      deck: 3,
      inkwell: elsaSpiritOfWinter.cost,
      hand: [elsaSpiritOfWinter],
    },
    {
      deck: 3,
      play: [pascalRapunzelCompanion],
    },
  );

  const cardUnderTest = testStore.getByZoneAndId("hand", elsaSpiritOfWinter.id);
  const target = testStore.getByZoneAndId(
    "play",
    pascalRapunzelCompanion.id,
    "player_two",
  );

  cardUnderTest.playFromHand();
  testStore.resolveOptionalAbility();
  testStore.resolveTopOfStack({ targetId: target.instanceId });

  expect(testStore.store.stackLayerStore.layers).toHaveLength(0);

  // Characters are exerted on first player turn
  expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
  testStore.passTurn();

  // Character does not ready on their turn
  expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));

  // Characters are still exerted on first player next  turn
  testStore.passTurn();
  expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));

  // Characters are ready on opponents second turn
  testStore.passTurn();
  expect(target.meta).toEqual(expect.objectContaining({ exerted: false }));
}

describe("Elsa - Spirit of Winter", () => {
  describe("DEEP FREEZE - When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.", () => {
    it("exert 1 chosen characters", () => {
      elsaSpiritOfWinterTargetingOneCharacterTestCase();
    });

    it("exert 2 chosen characters", () => {
      const testStore = new TestStore(
        {
          inkwell: elsaSpiritOfWinter.cost,
          hand: [elsaSpiritOfWinter],
          deck: 3,
        },
        {
          deck: 3,
          play: [pascalRapunzelCompanion, johnSilverAlienPirate],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        elsaSpiritOfWinter.id,
      );
      const targetOne = testStore.getByZoneAndId(
        "play",
        pascalRapunzelCompanion.id,
        "player_two",
      );
      const targetTwo = testStore.getByZoneAndId(
        "play",
        johnSilverAlienPirate.id,
        "player_two",
      );

      const targets = [targetOne, targetTwo];
      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [targetOne, targetTwo] });

      // Characters are exerted on first player turn
      targets.forEach((target) => {
        expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
      });

      testStore.passTurn();

      // Character does not ready on their turn
      targets.forEach((target) => {
        expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
      });

      // Characters are still exerted on first player next  turn
      testStore.passTurn();
      targets.forEach((target) => {
        expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
      });

      // Characters are ready on opponents second turn
      testStore.passTurn();
      targets.forEach((target) => {
        expect(target.meta).toEqual(
          expect.objectContaining({ exerted: false }),
        );
      });
    });
  });
});
