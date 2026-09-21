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
import { arakni } from "../heroes/arakni.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { snatchRed } from "../actions/snatch.ts";
import { takeAStabRed } from "./take-a-stab.ts";

/**
 * Take a Stab (HNT211) — Assassin / Warrior Attack Reaction, cost 0, 2{d}.
 *
 * Printed: "Target dagger attack gets +3{p} and \"When this hits a marked
 * hero, you may attack with it an additional time this turn.\""
 */

describe("Take a Stab (HNT211) AAA", () => {
  it("happy: target dagger attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [takeAStabRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(takeAStabRed);
    game.passBoth();

    // Nerve Scalpel 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, takeAStabRed).toBeIn("graveyard");
  });

  it("boundary: a non-dagger attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [takeAStabRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Arakni.must.playReaction(takeAStabRed));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, takeAStabRed).toBeIn("hand");
  });

  it("timing: hitting the marked hero grants the extra dagger swing without a prompt", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [takeAStabRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(takeAStabRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);

    // CR 5.2.3c: "you may" is the later activation choice, not an on-hit
    // decision — a full decline pass must still lift the dagger's limit.
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("defend");
    expectCombat(game).toBeOpen();
  });
});
