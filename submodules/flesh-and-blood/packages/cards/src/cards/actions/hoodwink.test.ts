import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { hoodwinkBlue } from "./hoodwink.ts";

/**
 * Hoodwink, Blue — Reviled Action - Attack.
 *
 * Printed: "Instant — Discard this and any number of other cards: Prevent the
 * next X arcane damage that would be dealt to your hero this turn, where X is
 * the total base {d} of cards discarded this way."
 */

describe("Hoodwink AAA", () => {
  it("happy: sums the base defense of Hoodwink and every other discarded card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hoodwinkBlue, nimblismBlue, snatchRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.endTurn();
    game.untilIdle({ optionals: "decline" });
    Blaze.must.pitch(nimblismBlue, nimblismBlue).play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    const hoodwinkId = Dash.cardIn("hand", hoodwinkBlue).instanceId;
    Dash.activate(hoodwinkBlue);
    game.advanceToDecision(Dash, "entity-target");
    const candidateIds = Dash.expectDecision("entity-target").candidates.map(
      (candidate) => candidate.instanceId,
    );
    expect(candidateIds).not.toContain(hoodwinkId);
    expect(candidateIds).toEqual(
      expect.arrayContaining([
        Dash.cardIn("hand", nimblismBlue).instanceId,
        Dash.cardIn("hand", snatchRed).instanceId,
      ]),
    );
    Dash.targetRequired(nimblismBlue, snatchRed);
    game.untilIdle();
    expectFabCard(Dash, hoodwinkBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: discarding only Hoodwink prevents its own 3 base defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [hoodwinkBlue], life: 20, actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.endTurn();
    game.untilIdle({ optionals: "decline" });
    Blaze.must.pitch(nimblismBlue, nimblismBlue).play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    Dash.activate(hoodwinkBlue);
    game.advanceToDecision(Dash, "entity-target");
    Dash.target();
    game.untilIdle();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
  });
});
