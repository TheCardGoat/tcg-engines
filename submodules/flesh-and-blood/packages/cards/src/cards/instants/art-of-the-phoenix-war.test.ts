import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { snatchRed } from "../actions/snatch.ts";
import { artOfThePhoenixWarRed } from "./art-of-the-phoenix-war.ts";

/**
 * Art of the Phoenix: War, Red (PEN254) — Draconic Instant, cost 1.
 *
 * Printed: "As an additional cost to play this, discard a Phoenix Flame.
 * Draconic attack action cards you control get +1{p} this turn. Draw 2 card."
 */

describe("Art of the Phoenix: War (PEN254) AAA", () => {
  it("happy: discarding a Phoenix Flame pays the additional cost and draws 2", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [artOfThePhoenixWarRed, phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(artOfThePhoenixWarRed);
    game.helpers.untilIdle();
    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
    expectFabCard(Fai, artOfThePhoenixWarRed).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveHandCount(2);
  });

  it("boundary: with no Phoenix Flame the required discard still cannot be paid", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [artOfThePhoenixWarRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    expectFabUnplayable(() => Fai.play(artOfThePhoenixWarRed));
    expectFabCard(Fai, artOfThePhoenixWarRed).toBeIn("hand");
  });

  it("timing: has no defense property, so it cannot be declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: fai, hand: [artOfThePhoenixWarRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expect(() => Fai.defendWith(artOfThePhoenixWarRed)).toThrow(/no defense property/);
    expectFabCard(Fai, artOfThePhoenixWarRed).toBeIn("hand");
  });
});
