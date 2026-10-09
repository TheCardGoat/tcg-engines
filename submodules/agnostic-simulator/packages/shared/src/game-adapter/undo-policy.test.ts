import { describe, expect, it } from "vitest";
import { hostedUndoProposalPolicy } from "./undo-policy";

describe("hosted undo consent", () => {
  it("requires opponent consent only in ranked matches", () => {
    expect(hostedUndoProposalPolicy.consentFor("undo", { matchType: "ranked" })).toBe("opponent");
    for (const matchType of [
      "casual",
      "testing",
      "private",
      "practice_vs_bot",
      "tournament",
      "league",
      "local",
    ]) {
      expect(hostedUndoProposalPolicy.consentFor("undo", { matchType })).toBe("automatic");
    }
  });
});
