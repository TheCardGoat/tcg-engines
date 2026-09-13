import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { shadenScreamRed } from "./shaden-scream.ts";

/**
 * Shaden Scream, Red (DTD118) — Shadow Brute Action (non-attack), cost 0, 3{d}.
 *
 * Printed: "As an additional cost to play this, banish a random card from
 * hand.\nYour next Brute or Shadow attack this turn gets +5{p}.\nGo again"
 */

describe("Shaden Scream family AAA", () => {
  it("happy: next Brute attack this turn gets +5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadenScreamRed, nimblismBlue],
        arsenal: [{ card: smashWithBigTreeRed, state: { faceDown: false } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.play(shadenScreamRed);
    game.helpers.untilIdle();
    expectFabCard(Levia, nimblismBlue).toBeIn("banished");
    Levia.playAttack(smashWithBigTreeRed, { from: "arsenal" });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(12);
  });

  it("boundary: with no other card in hand the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadenScreamRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(shadenScreamRed));
    expectFabCard(Levia, shadenScreamRed).toBeIn("hand");
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadenScreamRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 0, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Levia.defendWith([shadenScreamRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, shadenScreamRed).toBeIn("graveyard");
  });
});
