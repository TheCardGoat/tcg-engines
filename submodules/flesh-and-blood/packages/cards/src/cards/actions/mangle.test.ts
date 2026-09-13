import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { hyperX3 } from "../equipment/hyper-x3.ts";
import { nimblismBlue } from "./nimblism.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { snatchRed } from "./snatch.ts";
import { mangleRed } from "./mangle.ts";

/**
 * Mangle, Red (CRU026) — Guardian Action - Attack, cost 4, 8{p}, 3{d}.
 * Printed: "When this deals 4 or more damage to a hero, destroy target
 * equipment they control with a -1{d} counter."
 */

describe("Mangle, Red (CRU026) AAA", () => {
  it("happy: an unblocked 8 hit destroys their counter-bearing equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mangleRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], head: [hyperX3], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const headId = Dash.findCardInZone("head", hyperX3);
    game.setCounters(headId, { defenseCounterTotal: -1 });

    Bravo.playAttack(mangleRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, hyperX3).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: equipment without a -1{d} counter survives the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mangleRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], head: [hyperX3], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(mangleRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), hyperX3).toBeIn("head");
  });

  it("timing: a defended hit under 4 damage spares the counter-bearing equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mangleRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, regurgitatingSlogRed, snatchRed],
        head: [hyperX3],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const headId = Dash.findCardInZone("head", hyperX3);
    game.setCounters(headId, { defenseCounterTotal: -1 });

    Bravo.playAttack(mangleRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, regurgitatingSlogRed, snatchRed]);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, hyperX3).toBeIn("head");
  });
});
