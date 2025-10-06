/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  princeEricUrsulasGroom,
  ursulaVanessa,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Prince Eric - Ursula's Groom", () => {
  it("****UNDER VANESSA'S SPELL** While you have a character named Ursula in play, this character gains **Bodyguard** and gets +2 {W}️. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
    // Setup test with only Prince Eric in play
    const testEngine = new TestEngine({
      inkwell: princeEricUrsulasGroom.cost,
      play: [princeEricUrsulasGroom],
    });

    const ericCard = testEngine.getCardModel(princeEricUrsulasGroom);

    // Test initial state (without Ursula)
    expect(ericCard.hasBodyguard).toBe(false);
    expect(ericCard.willpower).toBe(princeEricUrsulasGroom.willpower);

    // Setup test with both Prince Eric and Ursula in play
    const testEngineWithUrsula = new TestEngine({
      inkwell: princeEricUrsulasGroom.cost,
      play: [princeEricUrsulasGroom, ursulaVanessa],
    });

    const ericCardWithUrsula = testEngineWithUrsula.getCardModel(
      princeEricUrsulasGroom,
    );

    // Test state with Ursula in play
    expect(ericCardWithUrsula.hasBodyguard).toBe(true);
    expect(ericCardWithUrsula.willpower).toBe(
      princeEricUrsulasGroom.willpower + 2,
    );
  });
});
