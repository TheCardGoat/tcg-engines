import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { evasiveNageboshiBlue } from "./evasive-nageboshi.ts";

/**
 * Evasive Nageboshi (OMN232) — Ninja Legendary Shuriken Item, 1{p}/2{d}.
 *
 * Printed:
 *   Action - {r}, {t}, destroy this when the combat chain closes: Attack.
 *   Go again
 *   When this attacks, this can't be defended by equipment or reaction cards
 *   this combat chain.
 *
 * Old pin flipped 2026-08-26: the module no longer encodes the deferred
 * chain-close destroy as an immediate destroy-self activation cost.
 */

describe("Evasive Nageboshi (OMN232) AAA", () => {
  it("boundary: unpaid {r} or AP still rejects the Action activation", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        arena: [evasiveNageboshiBlue],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(katsu).expectActivationRejected(evasiveNageboshiBlue);
    expectCombat(game).toBeClosed();
  });

  it("timing: the Shuriken stands through its own attack and is destroyed when the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        arena: [evasiveNageboshiBlue],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    // Act
    Katsu.activateAttack(evasiveNageboshiBlue);

    // Deferred destroy is not a paid cost: the Shuriken is live mid-combat.
    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Katsu, evasiveNageboshiBlue).toBeIn("arena");
    game.closeCombat({ ordering: "listed" });

    // Assert — hit landed, go again refunded AP, close fired the destroy.
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Katsu).toHaveAP(1);
    expectFabCard(Katsu, evasiveNageboshiBlue).toBeIn("graveyard");
  });

  it("boundary: another chain closing without Nageboshi attacking leaves it intact", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        arena: [evasiveNageboshiBlue],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    // Act — Snatch closes its own link while Nageboshi never attacked.
    Katsu.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    // Assert
    expectFabPlayer(Dash).toHaveLife(16); // 20 − 4{p}
    expectFabCard(Katsu, evasiveNageboshiBlue).toBeIn("arena");
  });
});
