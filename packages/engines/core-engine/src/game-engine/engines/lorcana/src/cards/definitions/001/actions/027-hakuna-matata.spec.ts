/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  magicBroomBucketBrigade,
  moanaOfMotunui,
  teKaTheBurningOne,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
