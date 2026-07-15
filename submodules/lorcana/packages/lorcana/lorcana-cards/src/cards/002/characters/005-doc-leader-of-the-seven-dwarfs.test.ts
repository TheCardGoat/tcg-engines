import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { docLeaderOfTheSevenDwarfs } from "./005-doc-leader-of-the-seven-dwarfs";
import { eudoraAccomplishedSeamstress } from "./007-eudora-accomplished-seamstress";
import { happyGoodnatured } from "./011-happy-good-natured";

describe("Doc - Leader of the Seven Dwarfs", () => {
  it("SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: eudoraAccomplishedSeamstress.cost - 1, // Should have exactly enough ink for Eudora with -1 reduction
      hand: [eudoraAccomplishedSeamstress],
      play: [{ card: docLeaderOfTheSevenDwarfs }],
    });

    // Quest with Doc
    expect(testEngine.asPlayerOne().quest(docLeaderOfTheSevenDwarfs)).toBeSuccessfulCommand();

    // Play Eudora with cost reduction - should succeed because of the -1 reduction
    expect(testEngine.asPlayerOne().playCard(eudoraAccomplishedSeamstress)).toBeSuccessfulCommand();

    // Verify Eudora is in play
    expect(testEngine.asPlayerOne().getCard(eudoraAccomplishedSeamstress)).toBeDefined();
  });

  it("expires before your next turn starts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [eudoraAccomplishedSeamstress],
      inkwell: eudoraAccomplishedSeamstress.cost - 1,
      play: [{ card: docLeaderOfTheSevenDwarfs }],
    });

    expect(testEngine.asPlayerOne().canPlayCard(eudoraAccomplishedSeamstress)).toBe(false);
    expect(testEngine.asPlayerOne().quest(docLeaderOfTheSevenDwarfs)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(eudoraAccomplishedSeamstress)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canPlayCard(eudoraAccomplishedSeamstress)).toBe(false);
  });

  it("only discounts the next character you play that turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [eudoraAccomplishedSeamstress, happyGoodnatured],
      inkwell: eudoraAccomplishedSeamstress.cost + happyGoodnatured.cost - 2,
      play: [{ card: docLeaderOfTheSevenDwarfs }],
    });

    expect(testEngine.asPlayerOne().quest(docLeaderOfTheSevenDwarfs)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(eudoraAccomplishedSeamstress)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(happyGoodnatured)).toBe(false);
  });
});
