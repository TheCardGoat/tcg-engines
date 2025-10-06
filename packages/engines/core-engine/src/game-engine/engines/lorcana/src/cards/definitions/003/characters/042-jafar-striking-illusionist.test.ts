/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { aWholeNewWorld } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { jafarStrikingIllusionist } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Jafar - Striking Illusionist", () => {
  it("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Jafar.)_**Evasive** _(Only characters with Evasive can challenge this character.)_**POWER BEYOND MEASURE** During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.", () => {
    const testStore = new TestStore({
      play: [jafarStrikingIllusionist],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      jafarStrikingIllusionist.id,
    );

    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("_**Evasive** _(Only characters with Evasive can challenge this character.)", () => {
    const testStore = new TestStore({
      play: [jafarStrikingIllusionist],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      jafarStrikingIllusionist.id,
    );

    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  describe("_**POWER BEYOND MEASURE** During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.", () => {
    it("draw a card", () => {
      const testStore = new TestStore({
        inkwell: pawpsicle.cost,
        play: [jafarStrikingIllusionist],
        hand: [pawpsicle],
        deck: 7,
      });

      const cardUnderTest = testStore.getCard(jafarStrikingIllusionist);
      cardUnderTest.updateCardMeta({ exerted: true });

      const pawpsicleCard = testStore.getCard(pawpsicle);
      pawpsicleCard.playFromHand();
      testStore.resolveOptionalAbility();

      expect(testStore.getPlayerLore("player_one")).toBe(1);
    });

    it("draws many cards", () => {
      const testStore = new TestStore(
        {
          inkwell: aWholeNewWorld.cost,
          play: [jafarStrikingIllusionist],
          hand: [aWholeNewWorld],
          deck: 7,
        },
        {
          hand: [dingleHopper],
          deck: 7,
        },
      );

      const cardUnderTest = testStore.getCard(jafarStrikingIllusionist);
      cardUnderTest.updateCardMeta({ exerted: true });

      const aWholeNewWorldCard = testStore.getCard(aWholeNewWorld);
      aWholeNewWorldCard.playFromHand();

      testStore.resolveTopOfStack({}, true);
      testStore.resolveTopOfStack({}, true);
      testStore.resolveTopOfStack({}, true);
      testStore.resolveTopOfStack({}, true);
      testStore.resolveTopOfStack({}, true);
      testStore.resolveTopOfStack({}, true);

      expect(testStore.getPlayerLore("player_one")).toBe(7);
      expect(testStore.getPlayerLore("player_two")).toBe(0);
    });
  });
});
