import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { stormweaverSAegis } from "./stormweaver-s-aegis.ts";

/**
 * Stormweaver's Aegis (PEN239) — Lightning Chest.
 *
 * Printed: Instant — Destroy this: Until end of turn, instant cards you own
 * get “Instant — Discard this: Prevent the next 2 damage that would be dealt
 * to you this turn.”
 */

describe("Stormweaver's Aegis (PEN239) AAA", () => {
  it("happy: discarding the granted Instant prevents the next 2 damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        chest: [stormweaverSAegis],
        hand: [sigilOfSolaceRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    Dash.activate(stormweaverSAegis);
    game.passBoth();
    Bravo.pass();
    Dash.activate(sigilOfSolaceRed);
    game.passBoth();
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, stormweaverSAegis).toBeIn("graveyard");
    expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
  });

  it("boundary: without activating Aegis, the Instant has no discard-prevent ability", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [stormweaverSAegis],
        hand: [sigilOfSolaceRed],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(Dash.expectActivationRejected(sigilOfSolaceRed).errorCode).toBe("no_activated_ability");
    expectFabCard(Dash, stormweaverSAegis).toBeIn("chest");
    expectFabCard(Dash, sigilOfSolaceRed).toBeIn("hand");
  });

  it("timing: the granted discard-prevent ability expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [stormweaverSAegis],
        hand: [sigilOfSolaceRed],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(stormweaverSAegis);
    game.untilIdle({ ordering: "listed" });
    Dash.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    game.as(bravo).pass();

    expect(Dash.expectActivationRejected(sigilOfSolaceRed).errorCode).toBe("no_activated_ability");
    expectFabCard(Dash, sigilOfSolaceRed).toBeIn("hand");
  });
});
