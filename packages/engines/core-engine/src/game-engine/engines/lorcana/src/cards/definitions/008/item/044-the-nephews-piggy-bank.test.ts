/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { donaldDuck } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  jumbaJookibaCriticalScientist,
  theNephewsPiggyBank,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("The Nephews' Piggy Bank", () => {
  it("INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.", async () => {
    const testEngine = new TestEngine({
      inkwell: theNephewsPiggyBank.cost - 1,
      play: [donaldDuck],
      hand: [theNephewsPiggyBank],
    });

    await testEngine.playCard(theNephewsPiggyBank);

    expect(testEngine.getCardModel(theNephewsPiggyBank).zone).toBe("play");
  });

  it("PAYOFF {e} – Chosen character gets -1 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        play: [theNephewsPiggyBank],
      },
      {
        play: [jumbaJookibaCriticalScientist],
      },
    );

    await testEngine.activateCard(theNephewsPiggyBank, {
      targets: [jumbaJookibaCriticalScientist],
    });

    expect(
      testEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
    ).toBe(jumbaJookibaCriticalScientist.strength - 1);

    await testEngine.passTurn();

    expect(
      testEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
    ).toBe(jumbaJookibaCriticalScientist.strength - 1);

    await testEngine.passTurn();

    expect(
      testEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
    ).toBe(jumbaJookibaCriticalScientist.strength);
  });
});
