/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  mauriceWorldFamousInventor,
  tinkerBellTinyTactician,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { ursulaShellNecklace } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";

describe("Maurice - World-Famous Inventor", () => {
  it("Give it a try: Whenever this character quests, you pay 2 {I} less for the next item you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: ursulaShellNecklace.cost - 2,
      hand: [ursulaShellNecklace],
      play: [mauriceWorldFamousInventor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mauriceWorldFamousInventor.id,
    );

    const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);

    cardUnderTest.quest();
    target.playFromHand();

    expect(target.zone).toEqual("play");
    expect(
      testStore.store.tableStore.getTable("player_one").inkAvailable(),
    ).toEqual(0);
  });

  describe("It works!: Whenever you play an item, you may draw a card.", () => {
    it("It works! - player plays an item", () => {
      const testStore = new TestStore({
        inkwell: ursulaShellNecklace.cost,
        deck: [tinkerBellTinyTactician],
        hand: [ursulaShellNecklace],
        play: [mauriceWorldFamousInventor],
      });

      const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);

      target.playFromHand();
      testStore.resolveTopOfStack();

      expect(target.zone).toEqual("play");
      expect(testStore.getZonesCardCount().hand).toEqual(1);
    });

    it("It works! - Opponent play an item", () => {
      const testStore = new TestStore(
        {
          inkwell: ursulaShellNecklace.cost,
          deck: [tinkerBellTinyTactician],
          hand: [ursulaShellNecklace],
        },
        {
          play: [mauriceWorldFamousInventor],
        },
      );

      const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);

      target.playFromHand();

      expect(target.zone).toEqual("play");
      expect(testStore.getZonesCardCount().hand).toEqual(0);
      expect(testStore.getZonesCardCount("player_two").hand).toEqual(0);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("It works! - Skip Effect", () => {
      const testStore = new TestStore({
        inkwell: ursulaShellNecklace.cost,
        deck: [tinkerBellTinyTactician],
        hand: [ursulaShellNecklace],
        play: [mauriceWorldFamousInventor],
      });

      const target = testStore.getByZoneAndId("hand", ursulaShellNecklace.id);

      target.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(target.zone).toEqual("play");
      expect(testStore.getZonesCardCount().hand).toEqual(0);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });
  });
});
