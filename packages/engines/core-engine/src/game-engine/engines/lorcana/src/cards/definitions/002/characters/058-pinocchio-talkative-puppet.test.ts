/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { pinocchioTalkativePuppet } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Pinocchio - Talkative Puppet", () => {
  it("**TELLING LIES** When you play this character, you may exert chosen opposing character.", () => {
    const testStore = new TestStore(
      {
        inkwell: pinocchioTalkativePuppet.cost,
        hand: [pinocchioTalkativePuppet],
      },
      {
        play: [pinocchioTalkativePuppet],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      pinocchioTalkativePuppet.id,
    );

    const target = testStore.getByZoneAndId(
      "play",
      pinocchioTalkativePuppet.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.ready).toBeFalsy();
  });
});
