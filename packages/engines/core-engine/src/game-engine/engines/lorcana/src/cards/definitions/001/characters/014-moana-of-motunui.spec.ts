/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  cinderellaGentleAndKind,
  johnSilverAlienPirate,
  moanaOfMotunui,
  rapunzelGiftedWithHealing,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/027-hakuna-matata";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Moana Of Motunui", () => {
  describe("We Can Fix It", () => {
    it("Ready All OTHER Princess", () => {
      const testStore = new TestStore({
        play: [
          moanaOfMotunui,
          cinderellaGentleAndKind,
          rapunzelGiftedWithHealing,
        ],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", moanaOfMotunui.id);
      const target = testStore.getByZoneAndId(
        "play",
        cinderellaGentleAndKind.id,
      );
      const anotherTarget = testStore.getByZoneAndId(
        "play",
        rapunzelGiftedWithHealing.id,
      );

      cardUnderTest.updateCardMeta({ exerted: false });
      target.updateCardMeta({ exerted: true });
      anotherTarget.updateCardMeta({ exerted: true });

      expect(testStore.getByZoneAndId("play", moanaOfMotunui.id).meta).toEqual(
        expect.objectContaining({ exerted: false }),
      );

      cardUnderTest.quest();
      testStore.resolveOptionalAbility();

      expect(target.meta).toEqual(expect.objectContaining({ exerted: false }));
      expect(anotherTarget.meta).toEqual(
        expect.objectContaining({ exerted: false }),
      );
      expect(cardUnderTest.meta).toEqual(
        expect.objectContaining({ exerted: true }),
      );
    });

    it("Should ready only princesses", () => {
      const testStore = new TestStore({
        play: [
          moanaOfMotunui,
          cinderellaGentleAndKind,
          rapunzelGiftedWithHealing,
          johnSilverAlienPirate,
        ],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", moanaOfMotunui.id);
      const target = testStore.getByZoneAndId(
        "play",
        cinderellaGentleAndKind.id,
      );
      const anotherTarget = testStore.getByZoneAndId(
        "play",
        rapunzelGiftedWithHealing.id,
      );
      const shouldNoBeTarget = testStore.getByZoneAndId(
        "play",
        johnSilverAlienPirate.id,
      );
      cardUnderTest.updateCardMeta({ exerted: false });
      target.updateCardMeta({ exerted: true });
      anotherTarget.updateCardMeta({ exerted: true });
      shouldNoBeTarget.updateCardMeta({ exerted: true });
      expect(testStore.getByZoneAndId("play", moanaOfMotunui.id).meta).toEqual(
        expect.objectContaining({ exerted: false }),
      );

      cardUnderTest.quest();

      testStore.resolveTopOfStack();

      expect(
        testStore.getByZoneAndId("play", cinderellaGentleAndKind.id).meta,
      ).toEqual(expect.objectContaining({ exerted: false }));
      expect(
        testStore.getByZoneAndId("play", rapunzelGiftedWithHealing.id).meta,
      ).toEqual(expect.objectContaining({ exerted: false }));
      expect(
        testStore.getByZoneAndId("play", johnSilverAlienPirate.id).meta,
      ).toEqual(expect.objectContaining({ exerted: true }));
    });
  });

  describe("Regression", () => {
    it("Readied princess are unable to sing", async () => {
      const testEngine = new TestEngine({
        play: [moanaOfMotunui, cinderellaGentleAndKind],
        hand: [hakunaMatata],
      });

      await testEngine.tapCard(cinderellaGentleAndKind);
      await testEngine.questCard(moanaOfMotunui);

      await testEngine.acceptOptionalLayer();

      await testEngine.singSong({
        singer: cinderellaGentleAndKind,
        song: hakunaMatata,
      });

      expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
      expect(testEngine.getCardModel(cinderellaGentleAndKind).ready).toEqual(
        false,
      );
    });
  });
});
