import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { unworldlyBellowRed } from "./unworldly-bellow.ts";

/**
 * Unworldly Bellow (LEV015) — Shadow Brute Action, cost 1, 3{d}.
 *
 * Printed: "As an additional cost to play Unworldly Bellow, banish 3 random
 * cards from your graveyard.
 * The next Brute or Shadow attack action card you play this turn gains +4{p}.
 * Go again"
 *
 * ENGINE GAP: required graveyard-banish additional costs are not in
 * `isPayablePlayCost` (only optional count-1 GY banish is), so the play is
 * denied even with 3 graveyard cards. The 3{d} block is still public.
 */

describe("Unworldly Bellow family AAA", () => {
  it("happy: next Brute attack action this turn gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [unworldlyBellowRed],
        graveyard: [nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [{ card: smashWithBigTreeRed, state: { faceDown: false } }],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.play(unworldlyBellowRed);
    game.helpers.untilIdle();
    expectFabCard(Levia, unworldlyBellowRed).toBeIn("graveyard");
    Levia.playAttack(smashWithBigTreeRed, { from: "arsenal" });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(11);
  });

  it("boundary: with an empty graveyard the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [unworldlyBellowRed],
        graveyard: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(unworldlyBellowRed));
    expectFabCard(Levia, unworldlyBellowRed).toBeIn("hand");
  });

  it("timing: printed 3{d} still defends an opposing attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: levia,
        hand: [unworldlyBellowRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Levia = game.as(levia);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Levia.defendWith(unworldlyBellowRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, unworldlyBellowRed).toBeIn("graveyard");
  });
});
