import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { auroraHoldingCourtEpic } from "./206-aurora-holding-court-epic";
import { theQueenWickedAndVain } from "./035-the-queen-wicked-and-vain";
import { mulanConsiderateDiplomat } from "./142-mulan-considerate-diplomat";

describe("Aurora - Holding Court (Epic)", () => {
  it("[QUEEN] ROYAL WELCOME - reduces cost by 1 for next Queen played this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: auroraHoldingCourtEpic }],
      hand: [{ card: theQueenWickedAndVain }],
      inkwell: theQueenWickedAndVain.cost - 1, // 1 less than needed
    });

    const auroraId = testEngine.findCardInstanceId(auroraHoldingCourtEpic, "play");
    const queenId = testEngine.findCardInstanceId(theQueenWickedAndVain, "hand");

    // Cannot play Queen without discount
    expect(testEngine.asPlayerOne().canPlayCard(queenId)).toBe(false);

    // Quest with Aurora
    testEngine.asPlayerOne().quest(auroraId);
    testEngine.asPlayerOne().resolvePendingByCard(auroraHoldingCourtEpic);

    // Now can play Queen (cost reduced by 1)
    expect(testEngine.asPlayerOne().canPlayCard(queenId)).toBe(true);

    testEngine.asPlayerOne().playCard(queenId);
    const queen = testEngine.asServer().getCard(queenId);
    expect(queen.zone).toBe("play");
  });

  it("[PRINCESS] ROYAL WELCOME - reduces cost by 1 for next Princess played this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: auroraHoldingCourtEpic }],
      hand: [{ card: mulanConsiderateDiplomat }],
      inkwell: mulanConsiderateDiplomat.cost - 1, // 1 less than needed
    });

    const auroraId = testEngine.findCardInstanceId(auroraHoldingCourtEpic, "play");
    const mulanId = testEngine.findCardInstanceId(mulanConsiderateDiplomat, "hand");

    // Cannot play Mulan without discount
    expect(testEngine.asPlayerOne().canPlayCard(mulanId)).toBe(false);

    // Quest with Aurora
    testEngine.asPlayerOne().quest(auroraId);
    testEngine.asPlayerOne().resolvePendingByCard(auroraHoldingCourtEpic);

    // Now can play Mulan (cost reduced by 1)
    expect(testEngine.asPlayerOne().canPlayCard(mulanId)).toBe(true);

    testEngine.asPlayerOne().playCard(mulanId);
    const mulan = testEngine.asServer().getCard(mulanId);
    expect(mulan.zone).toBe("play");
  });
});
