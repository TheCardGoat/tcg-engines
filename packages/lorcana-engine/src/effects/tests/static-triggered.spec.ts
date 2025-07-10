/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  controlYourTemper,
  healingGlow,
} from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  madHatterGraciousHost,
  magicBroomBucketBrigade,
  mauriceWorldFamousInventor,
  mickeyMouseTrueFriend,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { ursulaShellNecklace } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Static Continuous effects", () => {
  it("When opponent's card has a trigger to themselves, sets the right responder", () => {
    const testStore = new TestStore(
      {
        play: [mauriceWorldFamousInventor],
      },
      {
        deck: [magicBroomBucketBrigade],
        play: [madHatterGraciousHost],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      madHatterGraciousHost.id,
      "player_two",
    );

    const attacker = testStore.getByZoneAndId(
      "play",
      mauriceWorldFamousInventor.id,
    );

    cardUnderTest.updateCardMeta({ exerted: true });
    attacker.challenge(cardUnderTest);

    expect(testStore.stackLayers).toHaveLength(1);
    expect(testStore.store.priorityPlayer).toEqual("player_two");
  });

  describe("Quest trigger", () => {
    it.skip("should not trigger on quest when another character quests", () => {
      expect(false).toBeTruthy();
    });
  });

  describe("Play trigger", () => {
    it("should not trigger for opponents card if the player target is self", () => {});
    it("On play with invalid target (playing a character and the effect triggers for item)", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: controlYourTemper.cost + healingGlow.cost,
        hand: [controlYourTemper, healingGlow],
        play: [ursulaShellNecklace, mickeyMouseTrueFriend],
      });

      const aTarget = testStore.getByZoneAndId("hand", controlYourTemper.id);
      const anotherTarget = testStore.getByZoneAndId("hand", healingGlow.id);
      const mickey = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);

      aTarget.playFromHand();
      testStore.resolveTopOfStack({ targetId: mickey.instanceId });
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);

      expect(testStore.getZonesCardCount().deck).toBe(2);
      expect(testStore.getZonesCardCount().hand).toBe(1);

      anotherTarget.playFromHand();

      testStore.resolveTopOfStack({ targetId: mickey.instanceId });
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);

      expect(testStore.getZonesCardCount().deck).toBe(2);
      expect(testStore.getZonesCardCount().hand).toBe(0);
    });
  });

  it.skip("on banished triggers by cards that have banished effects", () => {
    expect(false).toBeTruthy();
  });

  it.skip("on banished triggers by cards that damage", () => {
    expect(false).toBeTruthy();
  });

  it.skip("on banished triggers by challenge", () => {
    expect(false).toBeTruthy();
  });
});
