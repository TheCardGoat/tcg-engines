import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { orRewriteHistory } from "./027-or-rewrite-history";

describe("Or Rewrite History!", () => {
  it("returns a character card from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [orRewriteHistory],
      inkwell: orRewriteHistory.cost,
      discard: [simbaProtectiveCub],
    });

    const playResult = testEngine.asPlayerOne().playCard(orRewriteHistory, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(orRewriteHistory)).toBe("discard");
  });
});
