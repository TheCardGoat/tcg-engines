import { describe, expect, it } from "bun:test";

import { getDeckRevealPresentation } from "./deck-reveal-presentation.js";

describe("deck reveal presentation", () => {
  it("makes a bottom-deck reveal and its dismissal action explicit", () => {
    expect(getDeckRevealPresentation("bottom")).toEqual({
      label: "Bottom of deck revealed",
      description: "Review the current bottom card",
      dismissLabel: "Dismiss bottom of deck reveal",
    });
  });

  it("uses the matching top-deck language", () => {
    expect(getDeckRevealPresentation("top").label).toBe("Top of deck revealed");
  });
});
