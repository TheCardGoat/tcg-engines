import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snagBlue } from "../instants/snag.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { snatchYellow } from "./snatch.ts";
import { sonataArcanixRed } from "./sonata-arcanix.ts";

/**
 * Sonata Arcanix (MON231) — Runeblade Action, cost X, go again.
 *
 * Printed: Reveal the top X+3 cards of your deck. For each non-attack action
 * card revealed this way, put an attack action card revealed this way into
 * your hand. Then deal arcane damage to target hero equal to the number of
 * cards put into your hand this way. Shuffle, then banish this.
 *
 * Hero for-each cannot iterate a revealed cohort. Repeat times count of
 * revealed-this-way non-attack actions, then stamp put-into-hand-this-way.
 */

describe("Sonata Arcanix (MON231) AAA", () => {
  it("happy: X=0 revealing 1 non-attack action puts 1 AAC into hand and deals 1", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sonataArcanixRed],
        deckTop: [snagBlue, snatchRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sonataArcanixRed, { xValue: 0, target: Dash });
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Viserai, snatchRed).toBeIn("hand");
    expectFabCard(Viserai, sonataArcanixRed).toBeBanished();
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Viserai).toHaveAP(1);
  });

  it("boundary: revealing no non-attack action puts nothing and deals 0", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sonataArcanixRed],
        deckTop: [snagBlue, snatchRed, snagBlue],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sonataArcanixRed, { xValue: 0, target: game.as(dash) });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Viserai).toHaveHandCount(0);
    expectFabCard(Viserai, sonataArcanixRed).toBeBanished();
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: 2 non-attack actions and 1 AAC puts only 1 card and deals 1", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sonataArcanixRed],
        deckTop: [nimblismBlue, snatchRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sonataArcanixRed, { xValue: 0, target: game.as(dash) });
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Viserai, snatchRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabCard(Viserai, sonataArcanixRed).toBeBanished();
  });

  it("interaction: repeated moves accumulate every card put into hand this way", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sonataArcanixRed],
        deckTop: [nimblismBlue, snatchRed, snatchYellow, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sonataArcanixRed, { xValue: 1, target: Dash });
    game.untilIdle({ ordering: "listed", entityTargets: "pause" });
    Viserai.target(snatchRed);
    game.untilIdle({ ordering: "listed", entityTargets: "pause" });
    Viserai.target(snatchYellow);
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Viserai).toHaveHandCount(2);
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
