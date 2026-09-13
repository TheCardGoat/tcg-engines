import { describe, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { silverwindShurikenBlue } from "../actions/silverwind-shuriken.ts";
import { whelmingGustwaveRed } from "../actions/whelming-gustwave.ts";
import { windCutter } from "./wind-cutter.ts";

/**
 * Wind Cutter (PEN029) — Ninja Equipment Arms d1 Blade Break.
 *
 * Printed: Attack Reaction - {r}, {t}: Search your deck for a Shuriken item,
 * put it into the arena, then shuffle. Activate this only if you've hit 2 or
 * more times this combat chain.
 */

describe("Wind Cutter (PEN029) AAA", () => {
  it("happy: after two hits this chain, search a Shuriken item into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        arms: [windCutter],
        hand: [whelmingGustwaveRed, whelmingGustwaveRed],
        resourcePoints: 1,
        actionPoints: 2,
        deckTop: [silverwindShurikenBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(whelmingGustwaveRed);
    game.closeCombat({ optionals: "decline" });
    Ira.playAttack(whelmingGustwaveRed);
    game.advanceCombatTo("reaction");
    Ira.expectActivationRejected(windCutter);
  });

  it("boundary: without two hits this combat chain the reaction is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        arms: [windCutter],
        hand: [whelmingGustwaveRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [silverwindShurikenBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(whelmingGustwaveRed);
    game.advanceCombatTo("reaction");
    Ira.expectActivationRejected(windCutter);
  });

  it("boundary: unpayable {r} cost is rejected even after two hits", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        arms: [windCutter],
        hand: [whelmingGustwaveRed, whelmingGustwaveRed],
        resourcePoints: 0,
        actionPoints: 2,
        deckTop: [silverwindShurikenBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(whelmingGustwaveRed);
    game.closeCombat({ optionals: "decline" });
    Ira.playAttack(whelmingGustwaveRed);
    game.advanceCombatTo("reaction");
    Ira.expectActivationRejected(windCutter);
  });
});
