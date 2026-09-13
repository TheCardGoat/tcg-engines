/** EVR195 Silver — three-resource action activation destroys Silver, draws, and has go again. */
import { describe, expect, it } from "vitest";

import { silver } from "../../../../cards/src/cards/tokens/silver.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Silver token (EVR195)", () => {
  it("AAA: spends exactly three resources, destroys itself, draws one, and grants go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], arena: [silver], deck: 8, resourcePoints: 3, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.handCount();

    Bravo.activate(silver);
    game.passBoth();

    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arena")).not.toContain(silver.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore + 1);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: cannot activate with only two resources", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], arena: [silver], deck: 8, resourcePoints: 2, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.handCount();

    expect(() => Bravo.activate(silver)).toThrow(/resource|cost|payment/i);
    expect(Bravo.zone("arena")).toContain(silver.canonicalId);
    expect(Bravo.resourcePoints()).toBe(2);
    expect(Bravo.handCount()).toBe(handBefore);
  });
});
