import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { pinionSentryBlue } from "./pinion-sentry.ts";

/**
 * Pinion Sentry, Blue (SEA023) — Mechanologist Block, 3{d}.
 * Printed: When this defends, you may {t} a cog you control. If you do, create
 * a Golden Cog token.
 */

describe("Pinion Sentry (SEA023) AAA", () => {
  it("happy: tapping a cog you control creates a Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [pinionSentryBlue],
        arena: [goldenCog],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(pinionSentryBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(goldenCog);

    expectFabCard(Dash, goldenCog).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 2);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: declining the tap does not create a Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [pinionSentryBlue],
        arena: [goldenCog],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(pinionSentryBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, goldenCog).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 1);
  });

  it("timing: with no cog the optional cannot create a Golden Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [pinionSentryBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(pinionSentryBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("golden-cog", 0);
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
