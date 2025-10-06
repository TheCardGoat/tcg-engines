/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { archimedesExceptionalOwl } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import { lightTheFuse } from "../../008";

describe("Archimedes - Exceptional Owl", () => {
  it("LEARN MORE Every time this character is targeted by an action or ability of an opposing person, you may draw 1 card.", async () => {
    const testEngine = new TestEngine(
      {
        play: [archimedesExceptionalOwl],
      },
      {
        inkwell: lightTheFuse.cost,
        hand: [lightTheFuse],
      },
    );

    const cardUnderTest = testEngine.getCardModel(archimedesExceptionalOwl);
    const actionCard = testEngine.getCardModel(lightTheFuse);

    testEngine.passTurn();
    testEngine.playCard(actionCard);
    await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });

    expect(cardUnderTest.damage).toBe(0);
    expect(testEngine.getCardsByZone("hand", "player_one").length).toBe(1);
  });
});
