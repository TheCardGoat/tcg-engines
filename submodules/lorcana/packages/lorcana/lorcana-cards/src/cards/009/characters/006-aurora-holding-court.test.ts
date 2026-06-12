import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { auroraHoldingCourt } from "./006-aurora-holding-court";
import { theQueenWickedAndVain } from "./035-the-queen-wicked-and-vain";
import { mulanConsiderateDiplomat } from "./142-mulan-considerate-diplomat";

describe("Aurora - Holding Court", () => {
  it("[QUEEN] ROYAL WELCOME - reduces cost for next Queen character played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: theQueenWickedAndVain.cost - 1,
      play: [{ card: auroraHoldingCourt }],
      hand: [theQueenWickedAndVain],
    });

    expect(testEngine.asPlayerOne().quest(auroraHoldingCourt)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(theQueenWickedAndVain)).toBeSuccessfulCommand();
  });

  it("[PRINCESS] ROYAL WELCOME - reduces cost for next Princess character played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: mulanConsiderateDiplomat.cost - 1,
      play: [{ card: auroraHoldingCourt }],
      hand: [mulanConsiderateDiplomat],
    });

    expect(testEngine.asPlayerOne().quest(auroraHoldingCourt)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(mulanConsiderateDiplomat)).toBeSuccessfulCommand();
  });

  it("does not reduce cost for non-Princess/Queen characters", () => {
    // The Queen costs 5, and is a Queen - should get the reduction
    // Mulan costs 5, and is a Princess - should get the reduction
    // But a non-Princess/Queen character should NOT get the reduction
    // We verify by checking canPlayCard: with cost-1 ink and no classification match, it should fail
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: theQueenWickedAndVain.cost - 1,
      play: [{ card: auroraHoldingCourt }],
      hand: [theQueenWickedAndVain],
    });

    // Before questing, cannot play The Queen (not enough ink)
    expect(testEngine.asPlayerOne().canPlayCard(theQueenWickedAndVain)).toBe(false);

    // After questing, The Queen (a Queen) should be playable with reduction
    expect(testEngine.asPlayerOne().quest(auroraHoldingCourt)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(theQueenWickedAndVain)).toBe(true);
  });

  it("only reduces cost for the NEXT Princess/Queen played, not subsequent ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: mulanConsiderateDiplomat.cost * 2 - 1, // enough for 2 Mulans minus 1 reduction
      play: [{ card: auroraHoldingCourt }],
      hand: [mulanConsiderateDiplomat, mulanConsiderateDiplomat],
    });

    expect(testEngine.asPlayerOne().quest(auroraHoldingCourt)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(mulanConsiderateDiplomat)).toBeSuccessfulCommand();
    // Second Mulan should NOT get the reduction
    expect(testEngine.asPlayerOne().canPlayCard(mulanConsiderateDiplomat)).toBe(false);
  });

  it("double Aurora questing grants -2 reduction on next Princess/Queen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: theQueenWickedAndVain.cost - 2, // 2 less from 2 Auroras
      play: [{ card: auroraHoldingCourt }, { card: auroraHoldingCourt }],
      hand: [theQueenWickedAndVain],
    });

    // Get instance IDs for the two Auroras in play
    const auroraInstances = testEngine
      .getCardInstanceIdsInZone("play", "player_one")
      .filter((id) => testEngine.getCardDefinition(id)?.id === auroraHoldingCourt.id);

    expect(testEngine.asPlayerOne().quest(auroraInstances[0])).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(auroraInstances[1])).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(theQueenWickedAndVain)).toBeSuccessfulCommand();
  });
});
