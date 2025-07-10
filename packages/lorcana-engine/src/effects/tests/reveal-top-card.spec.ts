/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { bounce } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import {
  daisyDuckDonaldsDate,
  petePastryChomper,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Reveal top card effect", () => {
  it("Top card goes to hand and it's still revealed", async () => {
    const testEngine = new TestEngine(
      {
        play: [daisyDuckDonaldsDate],
      },
      {
        deck: [bounce, petePastryChomper],
      },
    );

    await testEngine.questCard(daisyDuckDonaldsDate);

    await testEngine.changeActivePlayer("player_two");
    await testEngine.resolveTopOfStack({
      scry: { hand: [petePastryChomper], bottom: [] },
    });

    const target = testEngine.getCardModel(petePastryChomper);
    expect(target.zone).toBe("hand");
    expect(target.isRevealed).toBe(true);

    await testEngine.passTurn();

    expect(target.isRevealed).toBe(false);
  });
});
