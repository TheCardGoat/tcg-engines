import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { ironsongPrideRed } from "../instants/ironsong-pride.ts";
import { anticipatingGaze } from "./anticipating-gaze.ts";

/**
 * Anticipating Gaze (AHA003) — Warrior Head, Blade Break.
 * Printed: "When a sword attack you control hits, you may remove a +1{p}
 * counter from the sword. If you do, destroy this and draw a card."
 * Dawnblade (a real Sword) is armed with its +1{p} counter by Ironsong Pride.
 */

describe("Anticipating Gaze (AHA003) AAA", () => {
  it("happy: sword hit removes the counter, destroys this and draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        head: [anticipatingGaze],
        weapon1: [dawnblade],
        hand: [ironsongPrideRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    // Ironsong Pride arms Dawnblade with its printed +1{p} counter.
    Dori.play(ironsongPrideRed);
    game.untilIdle({ entityTargets: "pause" });
    Dori.target(dawnblade);
    game.untilIdle();

    Dori.activate(dawnblade);
    game.advanceCombatTo("defend");
    Dash.defendWith();
    // The hit arms the gaze and Dawnblade's own second-hit trigger together;
    // accepting the gaze optional removes the counter, destroys this and draws.
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Dori, anticipatingGaze).toBeIn("graveyard");
    expectFabPlayer(Dori).toHaveHandCount(1);
    expectFabCard(Dori, dawnblade).toHavePower(3);
  });

  it("boundary: declining keeps the counter on the sword and this equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        head: [anticipatingGaze],
        weapon1: [dawnblade],
        hand: [ironsongPrideRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.play(ironsongPrideRed);
    game.untilIdle({ entityTargets: "pause" });
    Dori.target(dawnblade);
    game.untilIdle();

    Dori.activate(dawnblade);
    game.advanceCombatTo("defend");
    Dash.defendWith();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dori, anticipatingGaze).toBeIn("head");
    expectFabPlayer(Dori).toHaveHandCount(0);
    expectFabCard(Dori, dawnblade).toHavePower(4);
  });
});
