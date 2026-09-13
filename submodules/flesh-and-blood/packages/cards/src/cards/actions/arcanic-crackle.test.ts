import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { chane } from "../heroes/chane.ts";
import { arcanicCrackleRed } from "./arcanic-crackle.ts";

/**
 * Arcanic Crackle, Red (MON235) — Runeblade Action - Attack, cost 0, 3{p}.
 * Printed: "When this attacks, deal 1 arcane damage to target hero."
 */

describe("Arcanic Crackle (MON235) AAA", () => {
  it("happy: attacking deals 1 arcane at declaration, then 3 combat damage", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [arcanicCrackleRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(arcanicCrackleRed, { stopAt: "on-attack" });
    Chane.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Chane, arcanicCrackleRed).toBeIn("graveyard");
  });

  it("boundary: Arcane Barrier 1 prevents the on-attack arcane; combat still deals 3", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [arcanicCrackleRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], resourcePoints: 1, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(arcanicCrackleRed, { stopAt: "on-attack" });
    Chane.target(Dash);
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: the arcane lands before combat damage, with the chain still open", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        life: 20,
        hand: [arcanicCrackleRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(arcanicCrackleRed, { stopAt: "on-attack" });
    Chane.target(Dash);
    game.advanceUntil({ stopAt: "defend" });

    expectFabPlayer(Dash).toHaveLife(19);
    expectCombat(game).toBeOpen();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
