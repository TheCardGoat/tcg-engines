import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { expediteBlue } from "../actions/expedite.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { nimblismBlue, nimblismRed, nimblismYellow } from "../actions/nimblism.ts";
import { driveBrake } from "./drive-brake.ts";

/**
 * Drive Brake (AMX006) — Mechanologist Legs d1, Battleworn.
 * Printed: "Whenever you banish a Hyper Driver from boosting, remove a -1{d}
 * counter from this. Battleworn"
 * Boost (CR 8.3.9e) banishes the deck's top card and stamps it
 * "from-boosting"; with the Hyper Driver seated on top of the deck the
 * Brake's trigger removes the Battleworn counter again.
 */

describe("Drive Brake (AMX006) AAA", () => {
  it("happy: banishing a Hyper Driver from boosting removes the -1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, life: 40, deck: 6 },
      {
        hero: teklovossen,
        legs: [driveBrake],
        hand: [expediteBlue, nimblismBlue, nimblismYellow, nimblismRed],
        deckTop: [hyperDriverRed],
        deck: 6,
        life: 20,
        resourcePoints: 0,
        actionPoints: 1,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklovossen = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed);
    Teklovossen.defendWith(driveBrake);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Teklovossen).toHaveLife(17); // 4{p} versus the brake's 1{d}
    expectFabCard(Teklovossen, driveBrake).toHaveDefenseCounters(-1); // Battleworn

    game.as(bravo).endTurn();

    // Dash's turn: boost banishes the Hyper Driver from the deck's top.
    Teklovossen.play(expediteBlue, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Teklovossen, hyperDriverRed).toBeBanished();
    expectFabCard(Teklovossen, driveBrake).toBeIn("legs");
    expectFabCard(Teklovossen, driveBrake).toHaveDefenseCounters(0);
  });

  it("boundary: a boost that banishes another card keeps the counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, life: 40, deck: 6 },
      {
        hero: teklovossen,
        legs: [driveBrake],
        hand: [expediteBlue, nimblismBlue, nimblismYellow, nimblismRed],
        deckTop: [snatchYellow],
        deck: 6,
        life: 20,
        resourcePoints: 0,
        actionPoints: 1,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklovossen = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed);
    Teklovossen.defendWith(driveBrake);
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Teklovossen, driveBrake).toHaveDefenseCounters(-1);

    game.as(bravo).endTurn();

    // Boost banishes a non-Hyper Driver deck top — the Brake never triggers.
    Teklovossen.play(expediteBlue, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Teklovossen, driveBrake).toBeIn("legs");
    expectFabCard(Teklovossen, driveBrake).toHaveDefenseCounters(-1);
  });
});
