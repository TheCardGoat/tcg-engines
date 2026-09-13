import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { kayoUnderhandedCheat } from "../heroes/kayo-underhanded-cheat.ts";
import { revoltingGestureRed } from "./revolting-gesture.ts";

/**
 * Revolting Gesture (SUP119) — Reviled Action, cost 1, 2{d}, go again.
 *
 * Printed: "Your next attack this turn gets +3{p}. Create a Might token. Go again"
 *
 * Might (TCC105) grants +1{p} when it destroys at the start of the controller's
 * next turn — it does not buff the same-turn follow-up.
 */

describe("Revolting Gesture (SUP119) AAA", () => {
  it("happy: creates Might and the next attack this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [revoltingGestureRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(revoltingGestureRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kayo).toHaveTokenCount("might", 1);

    Kayo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    // Might's +1{p} is a start-of-next-turn grant (TCC105), not same-turn.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a second attack this turn stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [revoltingGestureRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(revoltingGestureRed);
    game.helpers.resolveUntilIdle();
    Kayo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    Kayo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: Might pays +1{p} on the next turn's first attack; go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [revoltingGestureRed, brutalAssaultBlue, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    expectFabPlayer(Kayo).toHaveAP(1);
    Kayo.play(revoltingGestureRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kayo).toHaveAP(1);
    expectFabCard(Kayo, revoltingGestureRed).toBeIn("graveyard");
    expectFabPlayer(Kayo).toHaveTokenCount("might", 1);

    Kayo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Kayo).toHaveTokenCount("might", 0);

    Kayo.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });
});
