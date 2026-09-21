import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { spurLockedBlue } from "./spur-locked.ts";

/**
 * Spur Locked (HNT255) — Chaos Action, cost 0, go again.
 *
 * Printed: Each hero secretly chooses a number between 1 and 6, then those
 * numbers are revealed. The hero that chose the highest number loses that much
 * {h}, searches their deck for a card with cost less than or equal to the
 * chosen number, reveals it, puts it in their hand, then shuffles. Go again
 *
 * Each hero chooses 1–6 (opponent first). Highest loses that much life and
 * searches their deck. Ties pay both.
 */

describe("Spur Locked (HNT255) AAA", () => {
  it("happy: highest number loses that much life and searches cost ≤ that number", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spurLockedBlue],
        life: 20,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(spurLockedBlue);
    game.passBoth();
    Dash.choose("1");
    Bravo.choose("6");
    Bravo.targetRequired(snatchRed);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, spurLockedBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    Bravo.playAttack(snatchRed);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(16);
    expectCombat(game).toBeClosed();
    expectWait(game).toBeIdle();
  });

  it("boundary: tied highest — condition holds for every tied hero (ties pay both)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spurLockedBlue],
        life: 12,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 18,
        deckTop: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(spurLockedBlue);
    game.passBoth();
    Dash.choose("3");
    Bravo.choose("3");
    // Each tied-highest hero pays, then searches: answer both searches
    // (subjects are walked opponent-first, so Dash's search asks first).
    Dash.targetRequired(snatchRed);
    Bravo.targetRequired(snatchRed);
    game.untilIdle({ entityTargets: "minimum" });

    // "The hero that chose the highest number" covers both tied heroes:
    // each pays 3 and searches cost ≤ 3 (snatch is the deck top).
    expectFabPlayer(Bravo).toHaveLife(9);
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("timing: go again refunds the spent action point at resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spurLockedBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(spurLockedBlue);
    game.passBoth();
    Dash.choose("2");
    Bravo.choose("1");
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, spurLockedBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});

it("Only the opposing highest chooser searches; the controller keeps no card", () => {
  const padding = () => [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [spurLockedBlue],
      life: 20,
      resourcePoints: 0,
      deck: padding(),
      deckTop: [snatchRed],
    },
    { hero: dash, hand: [], life: 20, resourcePoints: 0, deck: padding(), deckTop: [snatchRed] },
    FAB_MANUAL_HARNESS,
  );
  const Bravo = game.as(bravo);
  const Dash = game.as(dash);
  Bravo.play(spurLockedBlue);
  game.passBoth();
  Dash.choose("6");
  Bravo.choose("1");
  Dash.targetRequired(snatchRed);
  game.untilIdle({ optionals: "throw", entityTargets: "throw" });
  expectFabPlayer(Dash).toHaveLife(14).toHaveHandCount(1);
  expectFabPlayer(Bravo).toHaveLife(20).toHaveHandCount(0).toHaveAP(1);
  expectFabCard(Dash, snatchRed).toBeIn("hand");
  expectWait(game).toBeIdle();
});
