/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { jafarKeeperOfSecrets } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Jafar - Keeper of Secrets", () => {
  it("**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.", () => {
    const testStore = new TestStore({
      deck: 10,
      play: [jafarKeeperOfSecrets],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      jafarKeeperOfSecrets.id,
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
