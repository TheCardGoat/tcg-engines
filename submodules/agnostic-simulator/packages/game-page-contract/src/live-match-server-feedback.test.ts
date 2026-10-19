import { describe, expect, it } from "vite-plus/test";
import { describeLiveMatchServerFeedback } from "./live-match-recovery";

describe("live server feedback", () => {
  it.each([
    "game_engine_failed",
    "game_state_incompatible",
    "game_operation_failed",
    "match_operation_failed",
  ])("does not blame an old board for %s", (code) => {
    const feedback = describeLiveMatchServerFeedback({ code, message: "private exception" });
    expect(feedback.severity).toBe("error");
    expect(feedback.title).not.toBe("Older board");
    expect(feedback.message).not.toContain("private exception");
  });
  it("keeps actual stale-state feedback separate", () => {
    expect(
      describeLiveMatchServerFeedback({ code: "rejected_stale", message: "stale" }).title,
    ).toBe("Older board");
  });
});
