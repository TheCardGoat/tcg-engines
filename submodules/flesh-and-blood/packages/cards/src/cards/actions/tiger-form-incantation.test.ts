import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { zen } from "../heroes/zen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tigerFormIncantationRed } from "./tiger-form-incantation.ts";

/**
 * Tiger Form Incantation, Red (MST063) — Mystic Ninja Action, cost 1, 3{d}, go again.
 *
 * Printed: "The next Crouching Tiger you play this turn gets +3{p}.
 * If you've pitched a blue card this turn, create a Crouching Tiger in your hand.
 * Go again"
 */

describe("Tiger Form Incantation (MST063) AAA", () => {
  it("happy: the next Crouching Tiger this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [tigerFormIncantationRed, crouchingTiger],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(tigerFormIncantationRed);
    game.helpers.resolveUntilIdle();
    expect(Zen.zone("hand")).not.toContain("token:crouching-tiger");
    Zen.playAttack(crouchingTiger);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: pitching a blue this turn creates a Crouching Tiger in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [tigerFormIncantationRed],
        pitch: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(tigerFormIncantationRed);
    game.helpers.resolveUntilIdle();
    expect(Zen.zone("hand")).toContain("token:crouching-tiger");
    expectFabCard(Zen, tigerFormIncantationRed).toBeIn("graveyard");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zen, hand: [tigerFormIncantationRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zen = game.as(zen);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Zen.defendWith(tigerFormIncantationRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zen).toHaveLife(19);
  });
});
