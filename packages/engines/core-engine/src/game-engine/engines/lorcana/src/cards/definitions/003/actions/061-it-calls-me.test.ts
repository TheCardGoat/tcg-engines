import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  mauiDemiGod,
  mauiHeroToAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { itCallsMe } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { moanaDeterminedExplorer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { mauiHalfshark } from "~/game-engine/engines/lorcana/src/cards/definitions/006";

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
