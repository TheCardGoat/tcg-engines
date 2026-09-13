import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dropOfDragonBloodRed } from "./drop-of-dragon-blood.ts";

/**
 * Drop of Dragon Blood (HNT155) — Draconic Instant, cost 2, Legendary.
 *
 * Printed: "Legendary
 * This costs {r} less to play for each Draconic chain link you control.
 * Gain {r}. Draw a card."
 *
 * Legendary is deckbuilding-only (out of 1v1 product scope).
 */

describe("Drop of Dragon Blood (HNT155) AAA", () => {
  it("happy: gain {r} and draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [dropOfDragonBloodRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    expectFabPlayer(Fai).toHaveAP(1);
    Fai.play(dropOfDragonBloodRed);
    game.helpers.resolveUntilIdle();

    // Instant: no AP. Pay 2{r}, then gain 1{r}. Draw the seeded top card.
    expectFabPlayer(Fai).toHaveAP(1);
    expectFabPlayer(Fai).toHaveResourceCount(1);
    expectFabCard(Fai, dropOfDragonBloodRed).toBeIn("graveyard");
    expectFabCard(Fai, brutalAssaultBlue).toBeIn("hand");
  });

  it("boundary: 0{r} and an empty hand cannot pay the printed cost", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [dropOfDragonBloodRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    expect(() => Fai.play(dropOfDragonBloodRed)).toThrow();
    expectFabCard(Fai, dropOfDragonBloodRed).toBeIn("hand");
  });

  it("timing: a Draconic chain link reduces the play cost by 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [dropOfDragonBloodRed, phoenixFlameRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("reaction");
    Fai.play(dropOfDragonBloodRed);
    game.helpers.resolveUntilIdle();

    // Printed cost 2, minus 1 Draconic chain link = 1{r}, then gain 1{r}.
    expectFabPlayer(Fai).toHaveResourceCount(2);
    expectFabCard(Fai, dropOfDragonBloodRed).toBeIn("graveyard");
    expectFabCard(Fai, brutalAssaultBlue).toBeIn("hand");
  });
});
