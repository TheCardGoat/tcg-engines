import { describe, expect, it } from "bun:test";

import { canSubmitDeckImport } from "./deck-import-form";

describe("deck-import-form", () => {
  it("allows submission only when the form is complete", () => {
    expect(
      canSubmitDeckImport({
        activeProfileId: "gp_1",
        deckName: "Emerald Steel Tempo",
        deckText: "4 Diablo - Devoted Herald",
        submitting: false,
      }),
    ).toBe(true);
  });

  it("blocks submission while missing required fields or already submitting", () => {
    expect(
      canSubmitDeckImport({
        activeProfileId: null,
        deckName: "Emerald Steel Tempo",
        deckText: "4 Diablo - Devoted Herald",
        submitting: false,
      }),
    ).toBe(false);
    expect(
      canSubmitDeckImport({
        activeProfileId: "gp_1",
        deckName: "  ",
        deckText: "4 Diablo - Devoted Herald",
        submitting: false,
      }),
    ).toBe(false);
    expect(
      canSubmitDeckImport({
        activeProfileId: "gp_1",
        deckName: "Emerald Steel Tempo",
        deckText: "  ",
        submitting: false,
      }),
    ).toBe(false);
    expect(
      canSubmitDeckImport({
        activeProfileId: "gp_1",
        deckName: "Emerald Steel Tempo",
        deckText: "4 Diablo - Devoted Herald",
        submitting: true,
      }),
    ).toBe(false);
  });
});
