import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayo } from "../heroes/kayo.ts";
import { snatchRed } from "./snatch.ts";
import { recklessChargeBlue } from "./reckless-charge.ts";

/**
 * Reckless Charge (HVY015) — Brute Action, Kayo Specialization, cost 0, 3{d}.
 *
 * Printed: Roll a 6 sided die. Gain action points equal to half the number
 * rolled, rounded down. If you've rolled a 6 on a die this turn, draw a card.
 *
 * Specialization (include only in Kayo decks) is deckbuilding-only and is
 * out of 1v1 engine scope.
 */

describe("Reckless Charge (HVY015) AAA", () => {
  it("happy: a roll of 6 gains 3 action points and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [recklessChargeBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: "j" },
    );
    const Kayo = game.as(kayo);

    Kayo.play(recklessChargeBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Kayo, recklessChargeBlue).toBeIn("graveyard");
    // Spent 1 AP, gained floor(6/2)=3 → 3 remaining. Rolled a 6, so draw.
    expectFabPlayer(Kayo).toHaveAP(3);
    expectFabPlayer(Kayo).toHaveHandCount(1);
    expectFabCard(Kayo, snatchRed).toBeIn("hand");
  });

  it("boundary: a roll of 1 gains no action points and does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [recklessChargeBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: "d" },
    );
    const Kayo = game.as(kayo);

    Kayo.play(recklessChargeBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kayo).toHaveAP(0);
    expectFabPlayer(Kayo).toHaveHandCount(0);
    expectFabCard(Kayo, recklessChargeBlue).toBeIn("graveyard");
  });

  it("timing: a non-6 roll this turn does not draw even when action points are gained", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [recklessChargeBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: "w3b-argh-b" },
    );
    const Kayo = game.as(kayo);

    Kayo.play(recklessChargeBlue);
    game.helpers.resolveUntilIdle();

    // floor(4/2) or floor(5/2) = 2 remaining AP; a2 does not draw.
    expectFabPlayer(Kayo).toHaveAP(2);
    expectFabPlayer(Kayo).toHaveHandCount(0);
  });
});
