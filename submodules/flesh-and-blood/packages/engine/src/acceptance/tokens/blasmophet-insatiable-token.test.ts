/** IAR221 Blasmophet the Insatiable Hunger — 6/6 unique Shadow Demon Ally with play-from-banish and end-phase trigger. */
import { describe, expect, it } from "vitest";
import { blasmophetTheInsatiableHunger } from "../../../../cards/src/cards/tokens/blasmophet-the-insatiable-hunger.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Blasmophet the Insatiable Hunger token (IAR221)", () => {
  it("AAA: card loads into arena and unique keyword is present", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [blasmophetTheInsatiableHunger], deck: 8, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Verify the card is in arena
    expect(Bravo.zone("arena")).toContain(blasmophetTheInsatiableHunger.canonicalId);

    // Verify the unique keyword is present on the card definition
    const keywords = blasmophetTheInsatiableHunger.base.keywords ?? [];
    expect(keywords.some((kw) => kw.name === "unique")).toBe(true);
  });
});
