/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  grammaTalaStoryteller,
  mauriceWorldFamousInventor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Gramma Tala - Storyteller", () => {
  it("**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore(
      {
        inkwell: grammaTalaStoryteller.cost,
        play: [grammaTalaStoryteller],
      },
      {
        play: [mauriceWorldFamousInventor],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      grammaTalaStoryteller.id,
    );

    cardUnderTest.updateCardMeta({ exerted: true });
    const attacker = testStore.getByZoneAndId(
      "play",
      mauriceWorldFamousInventor.id,
      "player_two",
    );

    attacker.challenge(cardUnderTest);
    testStore.resolveOptionalAbility();

    expect(cardUnderTest.zone).toEqual("inkwell");
    expect(cardUnderTest.ready).toEqual(false);
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
