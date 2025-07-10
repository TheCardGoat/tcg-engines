/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { befuddle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Befuddle", () => {
  it("Return an opponent character with cost 2.", () => {
    const testStore = new TestStore(
      {
        inkwell: befuddle.cost,
        hand: [befuddle],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
    const target = testStore.getByZoneAndId(
      "play",
      simbaProtectiveCub.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targets: [target],
    });

    expect(target.zone).toEqual("hand");
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 0 }),
    );
  });

  it("Return self character with cost 2.", () => {
    const testStore = new TestStore({
      inkwell: befuddle.cost,
      hand: [befuddle],
      play: [simbaProtectiveCub],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
    const target = testStore.getByZoneAndId("play", simbaProtectiveCub.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
    );
  });

  it("Return an opponent item with cost 2.", () => {
    const testStore = new TestStore(
      {
        inkwell: befuddle.cost,
        hand: [befuddle],
      },
      {
        play: [shieldOfVirtue],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
    const target = testStore.getByZoneAndId(
      "play",
      shieldOfVirtue.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 0 }),
    );
  });

  it("Return self item with cost 2.", () => {
    const testStore = new TestStore({
      inkwell: befuddle.cost,
      hand: [befuddle],
      play: [shieldOfVirtue],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
    const target = testStore.getByZoneAndId("play", shieldOfVirtue.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
    );
  });
});
