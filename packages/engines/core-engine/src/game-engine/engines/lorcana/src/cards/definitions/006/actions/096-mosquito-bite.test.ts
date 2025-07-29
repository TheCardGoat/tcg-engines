/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mosquitoBite } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

describe("Mosquito Bite", () => {
  it("Put 1 damage counter on chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mosquitoBite.cost,
        hand: [mosquitoBite],
        deck: 2,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    await testEngine.playCard(mosquitoBite);
    await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
    expect(testEngine.getCardModel(goofyKnightForADay).meta.damage).toEqual(1);
  });
});
