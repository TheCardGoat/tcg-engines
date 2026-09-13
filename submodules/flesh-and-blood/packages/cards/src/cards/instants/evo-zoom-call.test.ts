import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoZoomCallYellow } from "./evo-zoom-call.ts";

describe("Evo Zoom Call (EVO050) AAA", () => {
  it("happy: transforming a base head equips this and the banish-draw fires", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [evoZoomCallYellow, nimblismBlue],
        deckTop: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoZoomCallYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Teklo, evoZoomCallYellow).toBeIn("head");
    expect(Teklo.zone("head")).not.toContain(tekloBaseHead.canonicalId);
    expectFabCard(Teklo, nimblismBlue).toBeBanished();
    expectFabCard(Teklo, snatchRed).toBeIn("hand");
  });

  it("boundary: without a base head this does not enter the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoZoomCallYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoZoomCallYellow);
    game.helpers.resolveUntilIdle();

    expect(Teklo.zone("head")).not.toContain(evoZoomCallYellow.canonicalId);
    expectFabCard(Teklo, evoZoomCallYellow).toBeIn("graveyard");
  });

  it("timing: declining the equipped optional leaves the hand card", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [evoZoomCallYellow, nimblismBlue],
        deckTop: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoZoomCallYellow);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Teklo, evoZoomCallYellow).toBeIn("head");
    expectFabCard(Teklo, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Teklo).toHaveHandCount(1);
  });
});
