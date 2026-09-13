import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { headShotYellow } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { chartTheHighSeasBlue } from "./chart-the-high-seas.ts";

/**
 * Chart the High Seas (SEA048) — Pirate Necromancer Action, cost 0, go again.
 *
 * Printed: Look at the top 2 cards of your deck. You may pitch a blue card
 * from among them. Put the rest into your graveyard. Create a Gold token for
 * each yellow card put into your graveyard this way. Go again
 */

describe("Chart the High Seas (SEA048) AAA", () => {
  it("happy: pitching the looked-at blue mills the yellow and creates 1 Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [chartTheHighSeasBlue],
        actionPoints: 1,
        deckTop: [headShotYellow, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chartTheHighSeasBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });
    expectFabCard(Gravy, nimblismBlue).toBeIn("pitch");
    expectFabCard(Gravy, headShotYellow).toBeIn("graveyard");
    expectFabToken(game, "gold").toHaveCount(1);
  });

  it("boundary: milling two non-yellow cards creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [chartTheHighSeasBlue],
        actionPoints: 1,
        deckTop: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chartTheHighSeasBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Gravy, snatchRed).toBeIn("graveyard");
    expectFabCard(Gravy, nimblismBlue).toBeIn("graveyard");
    expectFabToken(game, "gold").toHaveCount(0);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [chartTheHighSeasBlue],
        actionPoints: 1,
        deckTop: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chartTheHighSeasBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Gravy).toHaveAP(1);
  });
});
