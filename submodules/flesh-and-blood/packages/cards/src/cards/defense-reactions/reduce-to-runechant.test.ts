import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { runechant } from "../tokens/runechant.ts";
import { reduceToRunechantRed } from "./reduce-to-runechant.ts";

/**
 * Reduce to Runechant Red (ARC088) — Runeblade Defense Reaction.
 *
 * Printed: Costs {r} less to play for each Runechant you control.
 * Create a Runechant token.
 */

describe("reduceToRunechant family AAA", () => {
  it("happy: resolving this creates a Runechant token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: viserai,
        hand: [reduceToRunechantRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Viserai.play(reduceToRunechantRed);
    game.helpers.resolveRestOfCombat();

    expect(Viserai.zone("arena")).toContain("token:runechant");
    expectFabCard(Viserai, reduceToRunechantRed).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveLife(20);
  });

  it("happy: each controlled Runechant reduces the play cost by 1{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: viserai,
        hand: [reduceToRunechantRed],
        arena: [runechant],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Viserai.play(reduceToRunechantRed);
    game.helpers.resolveRestOfCombat();

    expect(Viserai.zone("arena")).toContain("token:runechant");
    expectFabCard(Viserai, reduceToRunechantRed).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveResourceCount(0);
  });

  it("boundary: with no Runechants and no resources, it cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: viserai,
        hand: [reduceToRunechantRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();

    expectFabUnplayable(() => Viserai.play(reduceToRunechantRed), /cannot be paid/i);
  });

  it("timing: the Runechant created on resolution does not refund this play", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: viserai,
        hand: [reduceToRunechantRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Viserai.play(reduceToRunechantRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Viserai).toHaveResourceCount(0);
    expect(Viserai.zone("arena")).toContain("token:runechant");
  });
});
