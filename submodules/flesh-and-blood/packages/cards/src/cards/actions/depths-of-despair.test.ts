import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { levia } from "../heroes/levia.ts";
import { snatchRed } from "./snatch.ts";
import { depthsOfDespairRed } from "./depths-of-despair.ts";

/**
 * Depths of Despair, Red (PEN195) — Shadow Action - Attack, cost 3, 7{p}, 3{d}.
 * Printed: When this defends, banish it when the combat chain closes.
 * Blood Debt.
 *
 * ENGINE GAP: the defend trigger banishes `self` with `until: "this-combat-chain"`.
 * Banish-until is only reduced for EOT return (CR 8.5.1c); other windows fail
 * closed (`banish until-duration return window is not yet reduced`). Printed
 * text is a delayed banish at chain close, not a temporary banish-then-return.
 */

describe("Depths of Despair (PEN195) AAA", () => {
  it("happy (engine gap): defending throws banish until-duration (printed: banish at chain close)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: levia,
        hand: [depthsOfDespairRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Levia = game.as(levia);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("defend");

    expect(() => {
      Levia.defendWith(depthsOfDespairRed);
      game.untilIdle({ optionals: "decline" });
    }).toThrow(/banish until-duration return window is not yet reduced/);
  });

  it("boundary: if it never defends, it stays in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: levia,
        hand: [depthsOfDespairRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Levia = game.as(levia);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Levia.defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Levia, depthsOfDespairRed).toBeIn("hand");
  });

  it("timing: Blood Debt drains 1 life at end phase only while this is banished", () => {
    const banished = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [depthsOfDespairRed],
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    banished.as(levia).endTurn();
    banished.untilIdle({ optionals: "decline" });
    expectFabPlayer(banished.as(levia)).toHaveLife(19);

    const inHand = FabTestEngine.start(
      {
        hero: levia,
        hand: [depthsOfDespairRed],
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    inHand.as(levia).endTurn();
    inHand.untilIdle({ optionals: "decline" });
    expectFabPlayer(inHand.as(levia)).toHaveLife(20);
  });
});
