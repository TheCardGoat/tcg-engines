/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { smash } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  chipTheTeacupGentleSoul,
  merlinSquirrel,
  princeNaveenPennilessRoyal,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Squirrel", () => {
  describe("**LOOK BEFORE YOU LEAP** When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
    it.skip("When you play", () => {
      const testStore = new TestStore({
        deck: [chipTheTeacupGentleSoul, princeNaveenPennilessRoyal],
        inkwell: merlinSquirrel.cost,
        hand: [merlinSquirrel],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", merlinSquirrel.id);
      const first = testStore.getByZoneAndId(
        "deck",
        princeNaveenPennilessRoyal.id,
      );
      const last = testStore.getByZoneAndId("deck", chipTheTeacupGentleSoul.id);

      expect(testStore.store.tableStore.getTable().zones.deck.cards).toEqual([
        last,
        first,
      ]);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ scry: { top: [last] } });

      expect(testStore.store.tableStore.getTable().zones.deck.cards).toEqual([
        first,
        last,
      ]);
    });

    it.skip("When he leaves play", async () => {
      const testStore = new TestStore({
        inkwell: smash.cost,
        deck: [chipTheTeacupGentleSoul, princeNaveenPennilessRoyal],
        hand: [smash],
        play: [merlinSquirrel],
      });

      const testEngine = new TestEngine({
        inkwell: smash.cost,
        deck: [chipTheTeacupGentleSoul, princeNaveenPennilessRoyal],
        hand: [smash],
        play: [merlinSquirrel],
      });

      const first = testStore.getByZoneAndId(
        "deck",
        princeNaveenPennilessRoyal.id,
      );
      const last = testStore.getByZoneAndId("deck", chipTheTeacupGentleSoul.id);

      expect(testStore.store.tableStore.getTable().zones.deck.cards).toEqual([
        last,
        first,
      ]);

      await testEngine.playCard(smash);
      await testEngine.resolveTopOfStack(
        {
          targets: [merlinSquirrel],
        },
        true,
      );

      await testEngine.resolveTopOfStack({
        scry: { bottom: [princeNaveenPennilessRoyal] },
      });

      expect(testEngine.store.tableStore.getTable().zones.deck.cards).toEqual([
        testEngine.getCardModel(princeNaveenPennilessRoyal),
        testEngine.getCardModel(chipTheTeacupGentleSoul),
      ]);
    });
  });
});
