/** SEA124 Sticky Fingers — acceptance tests. */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { stickyFingers } from "../../../../cards/src/cards/companions/sticky-fingers.ts";
import { gold } from "../../../../cards/src/cards/tokens/gold.ts";

describe("Sticky Fingers (SEA124)", () => {
  it("AAA: steals a Gold token when attacking a hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [gold], deck: 4 },
      { hero: dash, weapon1: [stickyFingers], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(Bravo.zone("arena")).toContain(gold.canonicalId);

    Bravo.endTurn();
    Dash.activate(stickyFingers);
    game.resolveCombatNoReactions();

    // Trigger "When this attacks a hero, steal a Gold token" fires
    expect(Bravo.zone("arena")).not.toContain(gold.canonicalId);
    expect(Dash.zone("arena")).toContain(gold.canonicalId);
    expect(
      game
        .committedEvents()
        .some((event) => event.name === "move-zone" && event.data.reason === "steal"),
    ).toBe(true);

    Dash.endTurn();
    expect(Dash.zone("arena")).toContain(gold.canonicalId);
  });

  it("AAA: unequips after attacking", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, weapon1: [stickyFingers], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.activate(stickyFingers);
    game.passBoth();

    expect(Dash.zone("weapon1")).not.toContain(stickyFingers.canonicalId);
    expect(Dash.zone("inventory")).toContain(stickyFingers.canonicalId);
  });

  it("boundary: cannot activate when already in inventory", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, weapon1: [stickyFingers], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.activate(stickyFingers);
    game.passBoth();

    expect(() => Dash.activate(stickyFingers)).toThrow();
  });
});
