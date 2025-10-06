/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  goofyKnightForADay,
  jamesRoleModel,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("James - Role Model", () => {
  it("**NEVER, EVER LOSE SIGHT** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore(
      {
        play: [jamesRoleModel],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("play", jamesRoleModel.id);

    cardUnderTest.updateCardMeta({ exerted: true });
    const attacker = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
      "player_two",
    );

    attacker.challenge(cardUnderTest);

    testStore.resolveOptionalAbility();

    expect(cardUnderTest.zone).toEqual("inkwell");
    expect(cardUnderTest.ready).toEqual(false);
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
