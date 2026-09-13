import { describe, expect, it } from "vitest";
import { goldenCog } from "../../../../cards/src/cards/tokens/golden-cog.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Golden Cog (SEA042)", () => {
  it("AAA: card loads with crank keyword", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [goldenCog], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(goldenCog.canonicalId);
  });
});
