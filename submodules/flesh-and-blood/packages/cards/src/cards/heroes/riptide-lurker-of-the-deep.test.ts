import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { riptideLurkerOfTheDeep } from "./riptide-lurker-of-the-deep.ts";
import { iceQuakeRed } from "../actions/ice-quake.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * Riptide, Lurker of the Deep (OUT091) — Ranger hero.
 *
 * Printed (arsenal-fill leg): The first time each turn you play a
 * 'non-attack' action card, you may put a card from your hand face down into
 * your arsenal.
 */

describe("Riptide, Lurker of the Deep (OUT091) AAA", () => {
  it("happy: playing from hand seats another hand card face-down into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: riptideLurkerOfTheDeep,
        hand: [iceQuakeRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptideLurkerOfTheDeep);

    // ELE151 is a non-attack Ice action, so the fill resolves outside combat.
    Riptide.play(iceQuakeRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargets: "minimum",
      ordering: "listed",
    });

    expectFabCard(Riptide, brutalAssaultBlue).toBeIn("arsenal").toBeFaceDown();
  });

  it("boundary: declining the first offer does not make a second non-attack action eligible", () => {
    const game = FabTestEngine.start(
      {
        hero: riptideLurkerOfTheDeep,
        hand: [iceQuakeRed, nimblismBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptideLurkerOfTheDeep);

    Riptide.play(iceQuakeRed);
    game.advanceToDecision(Riptide, "boolean");
    Riptide.decline();
    game.helpers.resolveUntilIdle();
    expect(Riptide.zone("arsenal")).toHaveLength(0);

    Riptide.play(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expectWait(game).toBeIdle();
    expect(Riptide.zone("arsenal")).toHaveLength(0);
    expectFabCard(Riptide, brutalAssaultBlue).toBeIn("hand");
  });
});
