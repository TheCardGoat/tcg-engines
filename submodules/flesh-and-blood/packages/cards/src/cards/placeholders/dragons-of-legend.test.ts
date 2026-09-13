import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { dragonsOfLegend } from "./dragons-of-legend.ts";

// OUT_OF_SCOPE baseline (plan §5): every printed clause is deck registration or
// physical-card representation — "put this in your deck in place of an
// invocation you own" is deckbuilding-only, and "swap it for the invocation
// card" is a physical-swap rule with no engine primitive. The trio pins the
// in-game consequences: the placeholder is inert, unplayable, and indefensible.
describe("Dragons of Legend (UPR225) AAA", () => {
  it("happy: stays an inert hand card through a full attack (no swap, no arena object)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [nimbleStrikeRed, dragonsOfLegend], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.attackWith(nimbleStrikeRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, dragonsOfLegend).toBeIn("hand");
    expect(Dash.zone("arena")).toHaveLength(0);
  });

  it("boundary: cannot be played (no playable type — Invocation Placeholder Card)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [dragonsOfLegend], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    expect(() => Dash.play(dragonsOfLegend)).toThrow();
    expectFabCard(Dash, dragonsOfLegend).toBeIn("hand");
  });

  it("timing: cannot be declared as a defending card (no defense property)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [nimbleStrikeRed], deck: 6 },
      { hero: bravo, hand: [dragonsOfLegend], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(nimbleStrikeRed);

    expect(() => Bravo.defendWith(dragonsOfLegend)).toThrow();
    expectFabCard(Bravo, dragonsOfLegend).toBeIn("hand");
  });
});
