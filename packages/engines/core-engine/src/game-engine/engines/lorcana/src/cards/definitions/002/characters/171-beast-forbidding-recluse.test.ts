/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  beastForbiddingRecluse,
  rabbitReluctantHost,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Beast- Forbidding Recluse", () => {
  it("**YOU'RE NOT WELCOME HERE** When you play this character, you may deal 1 damage to chosen character.", () => {
    const testStore = new TestStore(
      {
        inkwell: beastForbiddingRecluse.cost,
        hand: [beastForbiddingRecluse],
      },
      {
        play: [rabbitReluctantHost],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      beastForbiddingRecluse.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      rabbitReluctantHost.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();

    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toEqual(1);
  });
});
