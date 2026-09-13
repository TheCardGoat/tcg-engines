import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { seekerSHood } from "./seeker-s-hood.ts";

describe("Seeker's Hood (OUT175) AAA", () => {
  it("happy: destroy this to prevent 1 and Opt 1 the top card to the bottom", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [seekerSHood],
        resourcePoints: 1,
        hand: [],
        deck: [snatchRed, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.activate(seekerSHood);
    const opt = game.advanceToDecision(Dash, "partition");
    game.answerDecision(Dash.id, {
      kind: "partition",
      groups: { top: [], bottom: opt.entries.map((entry) => entry.id) },
    });
    expectFabCard(Dash, seekerSHood).toBeIn("graveyard");
    expect(Dash.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: cannot activate without {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [seekerSHood],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).activate(seekerSHood)).toThrow();
    expectFabCard(game.as(dash), seekerSHood).toBeIn("head");
  });

  it("timing: without activating, Snatch deals the full 4", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [seekerSHood], resourcePoints: 1, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, seekerSHood).toBeIn("head");
  });
});
