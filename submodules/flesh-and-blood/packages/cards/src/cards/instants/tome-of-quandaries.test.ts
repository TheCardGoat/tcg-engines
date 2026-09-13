import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { tomeOfQuandariesBlue } from "./tome-of-quandaries.ts";

/**
 * Tome of Quandaries (OMN133) — Wizard Instant, cost 0.
 * Printed: "Create 2 Ponder tokens."
 */

describe("Tome of Quandaries (OMN133) AAA", () => {
  it("happy: creates 2 Ponder tokens and spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [tomeOfQuandariesBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(tomeOfQuandariesBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Iyslander).toHaveTokenCount("ponder", 2);
    expectFabPlayer(Iyslander).toHaveAP(1);
    expectFabCard(Iyslander, tomeOfQuandariesBlue).toBeIn("graveyard");
  });

  it("boundary: the opponent receives none of the Ponder tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [tomeOfQuandariesBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(tomeOfQuandariesBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("ponder", 0);
  });

  it("timing: may be cast in the reaction window", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: iyslander,
        hand: [tomeOfQuandariesBlue],
        deck: 6,
      },
    );
    game.as(dash).playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    game.as(iyslander).play(tomeOfQuandariesBlue);

    expectFabPlayer(game.as(iyslander)).toHaveTokenCount("ponder", 2);
  });
});
