/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  donaldDuck,
  donaldDuckMusketeer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { daisyDuckSecretAgent } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
