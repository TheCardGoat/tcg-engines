/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { cruellaDeVilFashionableCruiser } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Cruella De Vil - Fashionable Cruiser", () => {
  it("Now Get Going", () => {
    const testStore = new TestStore(
      {
        play: [cruellaDeVilFashionableCruiser],
      },
      { deck: 1 },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cruellaDeVilFashionableCruiser.id,
    );

    expect(cardUnderTest.hasEvasive).toEqual(true);
    testStore.passTurn();
    expect(cardUnderTest.hasEvasive).toEqual(false);
  });
});
