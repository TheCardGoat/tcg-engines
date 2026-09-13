import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "../actions/crouching-tiger.ts";
import { zen } from "../heroes/zen.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { whisperingMistBlue } from "./whispering-mist.ts";

/**
 * Whispering Mist, Blue (PEN267) — Mystic Instant, cost 0.
 *
 * Printed: "Until end of turn, blue attacks and attacks with ephemeral get
 * +1{p}."
 *
 * Authored as an at-resolution object scan of the stack. A later (or
 * combat-chain) attack is not on the stack at resolution, so the floating
 * this-turn grant never latches. Pin the missing +1 on a blue AAC and an
 * ephemeral Crouching Tiger; a red AAC staying at printed power is the
 * printed-correct contrast.
 */

describe("Whispering Mist (PEN267) AAA", () => {
  it("happy: a later blue attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [whisperingMistBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(whisperingMistBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Zen, whisperingMistBlue).toBeIn("graveyard");
    Zen.playAttack(brutalAssaultBlue);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(5);
  });

  it("boundary: a red attack stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [whisperingMistBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(whisperingMistBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
  });

  it("timing: an ephemeral Crouching Tiger gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [whisperingMistBlue, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(whisperingMistBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(crouchingTiger);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(1);
  });
});
