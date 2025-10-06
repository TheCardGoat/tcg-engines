/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { arielsGrottoASecretPlace } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ariel's Grotto - A Secret Place", () => {
  it("(no items) While you have 3 or more items in play, this location gets +2 {L}.", () => {
    const testStore = new TestStore({}, { play: [arielsGrottoASecretPlace] });

    testStore.passTurn();
    testStore.changePlayer("player_two");
    expect(testStore.getPlayerLore("player_two")).toBe(0);
  });
  it("(3 items) While you have 3 or more items in play, this location gets +2 {L}.", () => {
    const testStore = new TestStore(
      {},
      { play: [arielsGrottoASecretPlace, pawpsicle, pawpsicle, pawpsicle] },
    );

    testStore.passTurn();
    testStore.changePlayer("player_two");
    expect(testStore.getPlayerLore("player_two")).toBe(2);
  });
});
