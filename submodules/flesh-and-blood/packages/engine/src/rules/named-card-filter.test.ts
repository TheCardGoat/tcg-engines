import { describe, expect, it } from "vitest";
import { buildFabRulesView, FabTestEngine } from "../index.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "./fixtures.ts";

/**
 * CR 8.5.21 "cards with that name": filter hasStatus named-card reads the
 * name-card string binding. `name: "chosen"` is choose-card object identity
 * and does not match a named printed name.
 */
describe("named-card filter vs name:chosen", () => {
  it("matches printed names from the named-card string, not name:chosen", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, nimblismBlue], deck: 4 },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const view = buildFabRulesView(game.getState());
    const evaluated = (card: typeof snatchRed) => {
      const instanceId = Bravo.cardIn("hand", card).instanceId;
      const record = game.getState().objects[instanceId]!;
      return view.object({ instanceId: record.instanceId, incarnation: record.incarnation })!;
    };
    const snatch = evaluated(snatchRed);
    const nimblism = evaluated(nimblismBlue);
    const named = snatch.current.names[0] ?? snatch.base.names[0];
    expect(named).toBeTruthy();
    const context = {
      controllerId: Bravo.id,
      source: snatch.ref,
      bindings: {
        objects: {},
        numbers: {},
        strings: { "named-card": named, namedCard: named },
      },
    };

    expect(view.matchesFilter(snatch, { hasStatus: "named-card" }, context)).toBe(true);
    expect(view.matchesFilter(nimblism, { hasStatus: "named-card" }, context)).toBe(false);
    expect(view.matchesFilter(snatch, { name: "chosen" }, context)).toBe(false);
  });
});
