/**
 * DYN243 Gold token — action/destroy/draw acceptance.
 *
 * CR 8.6.16 defines Gold's activated Action ability; CR 3.0.12a makes the
 * token cease to exist after its destroy cost moves it out of the arena.
 */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

import { gold } from "../../../../cards/src/cards/tokens/gold.ts";

describe("Gold token (DYN243)", () => {
  it("AAA: pays two resources, destroys Gold, draws a card, and receives go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], arena: [gold], deck: 6, actionPoints: 1, resourcePoints: 2 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.zone("hand").length;

    Bravo.activate(gold);
    game.passBoth();

    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arena")).not.toContain(gold.canonicalId);
    expect(Bravo.zone("hand")).toHaveLength(handBefore + 1);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: Gold cannot be activated without its two-resource cost", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], arena: [gold], deck: 6, actionPoints: 1, resourcePoints: 1 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.zone("hand").length;

    expect(() => Bravo.activate(gold)).toThrow();

    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.zone("arena")).toContain(gold.canonicalId);
    expect(Bravo.zone("hand")).toHaveLength(handBefore);
  });
});
