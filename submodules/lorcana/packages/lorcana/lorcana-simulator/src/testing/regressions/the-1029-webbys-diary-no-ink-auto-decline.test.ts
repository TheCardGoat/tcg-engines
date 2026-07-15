import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { megaraSecretKeeper, webbysDiary, blessedBagpipes } from "@tcg/lorcana-cards/cards/010";

const drawnCard = createMockCharacter({
  id: "webby-no-ink-drawn",
  name: "Drawn",
  cost: 1,
});
const topDeckCard = createMockCharacter({
  id: "webby-no-ink-top",
  name: "Top",
  cost: 1,
});

describe("THE-1029 F-10: Webby's Diary no-ink edge case", () => {
  it("auto-declines the optional pay-cost trigger when player has no ink available", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [webbysDiary, megaraSecretKeeper],
      hand: [blessedBagpipes],
      inkwell: blessedBagpipes.cost,
      deck: [topDeckCard, drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const [bagpipesBagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolveBag(bagpipesBagEffect!.id, {
        resolveOptional: true,
        targets: [megaraSecretKeeper],
      }),
    ).toBeSuccessfulCommand();

    // Webby's Diary triggered, but all ink was spent on Bagpipes — the pay-1
    // optional must auto-decline rather than block the bag.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
