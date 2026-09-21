import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "./snatch.ts";
import { twistAndTurnRed } from "./twist-and-turn.ts";

/**
 * Twist and Turn (HNT122) — Warrior Action, cost 0, 3{d}, go again.
 *
 * Printed: Your next dagger attack this turn gets +4{p} and
 * "When this hits, you may attack with it an additional time this turn."
 * Go again
 */

describe("Twist and Turn (HNT122) AAA", () => {
  it("happy: the next dagger attack gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [twistAndTurnRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.play(twistAndTurnRed);
    game.passBoth();
    expectFabCard(Fang, twistAndTurnRed).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveAP(1);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a non-dagger attack is not the next dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [twistAndTurnRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.play(twistAndTurnRed);
    game.passBoth();
    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the dagger hit grants the extra swing without a prompt", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [twistAndTurnRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.must.play(twistAndTurnRed);
    game.passBoth();
    Fang.must.activate(obsidianFireVein);
    // CR 5.2.3c: "you may" is the later activation choice, not an on-hit
    // decision — a full decline pass must still lift the dagger's limit.
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(15);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(1);
  });
});
