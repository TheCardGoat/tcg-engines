/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jafarKeeperOfTheSecrets } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jafar - Keeper of Secrets", () => {
  it("**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.", () => {
    const testStore = new TestStore({
      deck: 10,
      play: [jafarKeeperOfTheSecrets],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      jafarKeeperOfTheSecrets.id,
    );

    expect(cardUnderTest.strength).toEqual(0);

    testStore.store.drawCard("player_one");
    expect(cardUnderTest.strength).toEqual(1);

    testStore.store.drawCard("player_one");
    expect(cardUnderTest.strength).toEqual(2);

    testStore.store.drawCard("player_one");
    expect(cardUnderTest.strength).toEqual(3);
  });
});
