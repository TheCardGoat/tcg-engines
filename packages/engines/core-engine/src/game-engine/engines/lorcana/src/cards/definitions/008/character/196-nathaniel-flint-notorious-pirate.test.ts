/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { fireTheCannons } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  jiminyCricketLevelheadedAndWise,
  nathanielFlintNotoriousPirate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Nathaniel Flint - Notorious Pirate", () => {
  it("PREDATORY INSTINCT You can't play this character unless an opposing character was damaged this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: nathanielFlintNotoriousPirate.cost,
      play: [],
      hand: [nathanielFlintNotoriousPirate],
    });

    const cardUnderTest = testEngine.getCardModel(
      nathanielFlintNotoriousPirate,
    );
    await testEngine.playCard(nathanielFlintNotoriousPirate);

    expect(cardUnderTest.zone).toBe("hand");
  });

  it("PREDATORY INSTINCT When damage has been dealt to opposing character this turn, you can play this character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
        play: [],
        hand: [nathanielFlintNotoriousPirate, fireTheCannons],
      },
      {
        play: [hiramFlavershamToymaker],
      },
    );

    await testEngine.playCard(fireTheCannons);
    await testEngine.resolveTopOfStack({ targets: [hiramFlavershamToymaker] });
    await testEngine.playCard(nathanielFlintNotoriousPirate);

    expect(testEngine.getCardModel(nathanielFlintNotoriousPirate).zone).toBe(
      "play",
    );
  });

  it("PREDATORY INSTINCT When damage has been dealt to owner's character this turn, you cannot play this character.", async () => {
    const testEngine = new TestEngine({
      inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
      play: [hiramFlavershamToymaker],
      hand: [nathanielFlintNotoriousPirate, fireTheCannons],
    });

    await testEngine.playCard(fireTheCannons);
    await testEngine.resolveTopOfStack({ targets: [hiramFlavershamToymaker] });
    await testEngine.playCard(nathanielFlintNotoriousPirate);

    expect(testEngine.getCardModel(nathanielFlintNotoriousPirate).zone).toBe(
      "hand",
    );
  });

  it("PREDATORY INSTINCT When opposing character is banished by the damage", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
        play: [],
        hand: [nathanielFlintNotoriousPirate, fireTheCannons],
      },
      {
        play: [jiminyCricketLevelheadedAndWise],
      },
    );

    await testEngine.playCard(fireTheCannons);
    await testEngine.resolveTopOfStack({
      targets: [jiminyCricketLevelheadedAndWise],
    });
    await testEngine.playCard(nathanielFlintNotoriousPirate);

    expect(testEngine.getCardModel(nathanielFlintNotoriousPirate).zone).toBe(
      "play",
    );
  });
});
