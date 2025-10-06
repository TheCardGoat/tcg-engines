/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arthurKingVictorious,
  merlinBackFromTheBermudas,
  monstroWhaleOfAWhale,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Back from the Bermudas", () => {
  it("**LONG LIVE THE KING!** Your Arthur characters give **Resist** +1 _(Damage dealt to this character is reduced by 1)_", () => {
    const testStore = new TestStore({
      inkwell: merlinBackFromTheBermudas.cost,
      play: [
        merlinBackFromTheBermudas,
        arthurKingVictorious,
        monstroWhaleOfAWhale,
      ],
    });

    const cardUnderTest = testStore.getCard(merlinBackFromTheBermudas);
    const arthur = testStore.getCard(arthurKingVictorious);
    const monstro = testStore.getCard(monstroWhaleOfAWhale);

    expect(cardUnderTest.hasResist).toEqual(false);
    expect(arthur.hasResist).toEqual(true);
    expect(monstro.hasResist).toEqual(false);
  });
});
