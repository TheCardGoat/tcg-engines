import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { riptide } from "../heroes/riptide.ts";
import { tigerTrapRed } from "../defense-reactions/tiger-trap.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { reelInBlue } from "./reel-in.ts";

/**
 * Reel In (HVY250) — Ranger Instant, blue, reload.
 *
 * Printed: "Look at the top X+1 cards of your deck. Choose up to 4 traps,
 * reveal them, put them into your hand, then shuffle. Reload"
 */

describe("Reel In (HVY250) AAA", () => {
  it("happy: looking at X+1 puts chosen traps from that cohort into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [reelInBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed, tigerTrapRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    Riptide.play(reelInBlue, { xValue: 2 });
    game.helpers.resolveUntilIdle({
      entityTargets: "maximum",
      optionalBoolean: false,
    });

    expectFabCard(Riptide, tigerTrapRed).toBeIn("hand");
    expect(Riptide.zone("deck")).not.toContain(tigerTrapRed.canonicalId);
    expectFabCard(Riptide, reelInBlue).toBeIn("graveyard");
  });

  it("boundary: a non-trap on top of the deck is not put into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [reelInBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    Riptide.play(reelInBlue, { xValue: 0 });
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      optionalBoolean: false,
    });
    expect(Riptide.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Riptide.zone("hand")).not.toContain(snatchRed.canonicalId);
  });

  it("timing: resolving the look/search leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [reelInBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, tigerTrapRed, tigerTrapRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    Riptide.play(reelInBlue, { xValue: 1 });
    game.helpers.resolveUntilIdle({
      entityTargets: "maximum",
      optionalBoolean: false,
    });
    expectFabCard(Riptide, reelInBlue).toBeIn("graveyard");
  });
});
