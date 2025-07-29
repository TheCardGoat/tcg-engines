import { describe, expect, it } from "bun:test";
import {
  magicBroomBucketBrigade,
  moanaOfMotunui,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hakuna Matata", () => {
  it("Heals all characters", () => {
    const cardsInHand = [
      magicBroomBucketBrigade,
      teKaTheBurningOne,
      moanaOfMotunui,
    ];
    const testStore = new TestStore({
      play: cardsInHand,
      inkwell: hakunaMatata.cost,
      hand: [hakunaMatata],
    });
    cardsInHand.forEach((card, index) => {
      const cardModel = testStore.getByZoneAndId("play", card.id);
      cardModel.updateCardMeta({ damage: 3 });
      expect(cardModel.meta).toEqual(expect.objectContaining({ damage: 3 }));
    });

    testStore.store.playCardFromHand(
      testStore.getByZoneAndId("hand", hakunaMatata.id).instanceId,
    );

    cardsInHand.forEach((card) => {
      const cardModel = testStore.getByZoneAndId("play", card.id);
      expect(cardModel.meta.damage).toBeFalsy();
    });
  });
});
