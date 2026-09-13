import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zen } from "../heroes/zen.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { billowingMistBlue } from "./billowing-mist.ts";

/**
 * Billowing Mist, Blue (PEN272) — Mystic Action, cost 0, 2{d}, go again.
 *
 * Printed: "Your next attack this turn gets +1{p}. The next time you would
 * create a card with ephemeral this turn, instead create that many plus 1.
 * Go again"
 *
 * The next-attack +1{p} latch is public (Generic recipients included). The
 * create-extra replacement is not asserted here — pin only if a later suite
 * needs it.
 */

describe("Billowing Mist (PEN272) AAA", () => {
  it("happy: the next attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [billowingMistBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(billowingMistBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Zen).toHaveAP(1);
    Zen.playAttack(brutalAssaultBlue);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(5);
  });

  it("boundary: a second attack the same turn stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [billowingMistBlue, brutalAssaultBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(billowingMistBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });

    Zen.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +1{p} expires after the turn cycle", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [billowingMistBlue, snatchRed],
        actionPoints: 1,
        deck: 8,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(billowingMistBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Zen, billowingMistBlue).toBeIn("graveyard");
    Zen.endTurn();
    game.as(dash).endTurn();
    game.helpers.untilIdle();

    Zen.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
  });
});
