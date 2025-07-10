/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  donaldDuck,
  donaldDuckMusketeer,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { daisyDuckSecretAgent } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Daisy Duck - Secret Agent", () => {
  it("**THWART** Whenever this character quests, each opponent chooses and discards a card.", () => {
    const testStore = new TestStore(
      {
        play: [daisyDuckSecretAgent],
      },
      {
        hand: [donaldDuck, donaldDuckMusketeer],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      daisyDuckSecretAgent.id,
    );
    const target = testStore.getByZoneAndId(
      "hand",
      donaldDuck.id,
      "player_two",
    );

    cardUnderTest.quest();
    testStore.changePlayer().resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });
});
