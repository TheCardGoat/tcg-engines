/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ursulaShellNecklace } from "@lorcanito/lorcana-engine/cards/001/items/items";
import {
  grabYourSword,
  hakunaMatata,
  reflection,
} from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Ursula's Shell Necklace", () => {
  describe('"NOW, SING! - Whenever you play a song, you may pay 1 **{I}** to draw a card.', () => {
    it("Drawing cards", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: hakunaMatata.cost + grabYourSword.cost + 2,
        hand: [hakunaMatata, grabYourSword],
        play: [ursulaShellNecklace],
      });

      const aTarget = testStore.getByZoneAndId("hand", hakunaMatata.id);
      const anotherTarget = testStore.getByZoneAndId("hand", grabYourSword.id);

      aTarget.playFromHand();
      testStore.resolveTopOfStack();

      expect(testStore.getZonesCardCount().deck).toBe(1);
      expect(testStore.getZonesCardCount().hand).toBe(2);

      anotherTarget.playFromHand();
      testStore.resolveTopOfStack();

      expect(testStore.getZonesCardCount().deck).toBe(0);
      expect(testStore.getZonesCardCount().hand).toBe(2);
      expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("Not having ink to pay cost should skip effect", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: hakunaMatata.cost,
        hand: [hakunaMatata],
        play: [ursulaShellNecklace],
      });

      const aTarget = testStore.getByZoneAndId("hand", hakunaMatata.id);

      aTarget.playFromHand();
      testStore.resolveTopOfStack();

      expect(testStore.getZonesCardCount().deck).toBe(2);
      expect(testStore.getZonesCardCount().hand).toBe(0);

      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("Skipping effects", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: hakunaMatata.cost + grabYourSword.cost,
        hand: [hakunaMatata, grabYourSword],
        play: [ursulaShellNecklace],
      });

      const aTarget = testStore.getByZoneAndId("hand", hakunaMatata.id);
      const anotherTarget = testStore.getByZoneAndId("hand", grabYourSword.id);

      aTarget.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(testStore.getZonesCardCount().deck).toBe(2);
      expect(testStore.getZonesCardCount().hand).toBe(1);

      anotherTarget.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(testStore.getZonesCardCount().deck).toBe(2);
      expect(testStore.getZonesCardCount().hand).toBe(0);
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    // TODO: I don't know the official ruling on this. I'm doing what makes most sense to me.
    it("Necklace's effect, resolves after the effect that triggers it.", () => {
      const testStore = new TestStore({
        inkwell: reflection.cost,
        hand: [reflection],
        play: [ursulaShellNecklace],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        ursulaShellNecklace.id,
      );
      const aTarget = testStore.getByZoneAndId("hand", reflection.id);
      aTarget.playFromHand();

      expect(testStore.store.stackLayerStore.layers).toHaveLength(2);
      expect(testStore.store.stackLayerStore.layers[0]?.instanceId).toEqual(
        cardUnderTest.instanceId,
      );
      expect(testStore.store.stackLayerStore.layers[1]?.instanceId).toEqual(
        aTarget.instanceId,
      );
    });
  });
});
