import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bubbleToTheSurfaceRed } from "./bubble-to-the-surface.ts";

/**
 * Bubble to the Surface (HNT154) — Draconic Instant, cost 2.
 *
 * Printed: "This costs {r} less to play for each Draconic chain link you
 * control. Reveal cards from the top of your deck until you've revealed a red
 * card. Banish it. You may play it this turn. Shuffle."
 */

describe("Bubble to the Surface (HNT154) AAA", () => {
  it("happy: reveals until a red card, banishes it, and may play it this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bubbleToTheSurfaceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(bubbleToTheSurfaceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Fai, bubbleToTheSurfaceRed).toBeIn("graveyard");
    expectFabCard(Fai, snatchRed).toBeBanished();

    Fai.attackWith(snatchRed, { from: "banished" });
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fai, snatchRed).toBeIn("combatChain");
  });

  it("boundary: declining the play permission leaves the red card banished", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bubbleToTheSurfaceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(bubbleToTheSurfaceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Fai, snatchRed).toBeBanished();
    expect(() => Fai.attackWith(snatchRed, { from: "banished" })).toThrow(
      /Playing from banished requires a migrated permission effect/,
    );
  });

  it("timing: a Draconic chain link reduces the play cost by 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bubbleToTheSurfaceRed, phoenixFlameRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [brutalAssaultBlue, snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("reaction");
    Fai.play(bubbleToTheSurfaceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Printed cost 2, minus 1 Draconic chain link = 1{r}.
    expectFabPlayer(Fai).toHaveResourceCount(1);
    expectFabCard(Fai, bubbleToTheSurfaceRed).toBeIn("graveyard");
  });
});
