import { describe, expect, it } from "bun:test";

import { dismissDeckReveal, isDeckRevealDismissed } from "./deck-reveal-dismissal.js";

describe("deck reveal dismissal", () => {
  it("keeps a reveal dismissed while its card remains the same", () => {
    const dismissals = dismissDeckReveal({}, "bottom", "card-1");

    expect(isDeckRevealDismissed(dismissals, "bottom", "card-1")).toBe(true);
  });

  it("shows the reveal again when the card at that deck position changes", () => {
    const dismissals = dismissDeckReveal({}, "bottom", "card-1");

    expect(isDeckRevealDismissed(dismissals, "bottom", "card-2")).toBe(false);
  });

  it("keeps top and bottom dismissal state independent", () => {
    const dismissals = dismissDeckReveal({}, "top", "card-1");

    expect(isDeckRevealDismissed(dismissals, "top", "card-1")).toBe(true);
    expect(isDeckRevealDismissed(dismissals, "bottom", "card-1")).toBe(false);
  });
});
