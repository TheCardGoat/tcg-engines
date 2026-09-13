/** CRU197 Copper — four-resource action activation destroys Copper, draws, and has go again. */
import { describe, expect, it } from "vitest";

import { copper } from "../../../../cards/src/cards/tokens/copper.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Copper token (CRU197)", () => {
  it("AAA: spends exactly four resources, destroys itself, draws one, and grants go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], arena: [copper], deck: 8, resourcePoints: 4, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.handCount();

    Bravo.activate(copper);
    game.passBoth();

    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arena")).not.toContain(copper.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore + 1);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: cannot activate with only three resources", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], arena: [copper], deck: 8, resourcePoints: 3, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.handCount();

    expect(() => Bravo.activate(copper)).toThrow(/resource|cost|payment/i);
    expect(Bravo.zone("arena")).toContain(copper.canonicalId);
    expect(Bravo.resourcePoints()).toBe(3);
    expect(Bravo.handCount()).toBe(handBefore);
  });
});
