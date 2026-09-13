import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prowlRed } from "../actions/prowl.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { seekerKunaiRed } from "./seeker-kunai.ts";

/**
 * Seeker Kunai (PEN142) — Assassin Instant Item.
 *
 * Printed: Attack Reaction - {r}, destroy this: Target Assassin attack
 * action card gets +1{p}.
 */

describe("Seeker Kunai (PEN142) AAA", () => {
  it("happy: destroying this gives the Assassin attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [seekerKunaiRed],
        hand: [prowlRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(prowlRed);
    game.toReaction("attacker");
    expectCombat(game).toHaveAttackPower(3);

    Bravo.activate(seekerKunaiRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Bravo, seekerKunaiRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack is not a legal +1{p} target", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [seekerKunaiRed],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.toReaction("attacker");
    Bravo.expectActivationRejected(seekerKunaiRed);
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Bravo, seekerKunaiRed).toBeIn("arena");
  });

  it("timing: the Attack Reaction is illegal before an attack is on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [seekerKunaiRed],
        hand: [prowlRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(seekerKunaiRed);
    expectFabCard(Bravo, seekerKunaiRed).toBeIn("arena");
  });

  it("happy: at the start of your turn you may destroy 2 Silver to return this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        graveyard: [seekerKunaiRed],
        arena: [fabToken("silver"), fabToken("silver")],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle({
      optionals: "accept",
      entityTargets: "maximum",
      ordering: "listed",
    });

    expectFabCard(Bravo, seekerKunaiRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveTokenCount("silver", 0);
  });
});
