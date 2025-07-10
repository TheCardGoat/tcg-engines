/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mauiDemiGod,
  mauiHeroToAll,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { itCallsMe } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { moanaDeterminedExplorer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("It Calls Me", () => {
  it("Draw a card. Shuffle up to 3 cards from your opponent’s discard into your opponent’s deck.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 1,
        hand: [itCallsMe],
        deck: [moanaDeterminedExplorer],
      },
      {
        inkwell: 1,
        hand: [],
        discard: [mauiHalfshark, mauiDemiGod, mauiHeroToAll],
      },
    );

    await testEngine.playCard(itCallsMe, {
      targets: [mauiDemiGod, mauiHeroToAll, mauiHalfshark],
    });

    expect(testEngine.getCardModel(mauiHalfshark).zone).toBe("deck");
    expect(testEngine.getCardModel(mauiDemiGod).zone).toBe("deck");
    expect(testEngine.getCardModel(mauiHeroToAll).zone).toBe("deck");

    expect(testEngine.getCardModel(moanaDeterminedExplorer).zone).toBe("hand");
  });

  it("Still draws when opp has no cards in discard", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 1,
        hand: [itCallsMe],
        deck: [moanaDeterminedExplorer],
      },
      {
        deck: 10,
        hand: [],
        discard: [],
      },
    );

    await testEngine.playCard(itCallsMe);

    expect(testEngine.getCardModel(moanaDeterminedExplorer).zone).toBe("hand");
  });
});
