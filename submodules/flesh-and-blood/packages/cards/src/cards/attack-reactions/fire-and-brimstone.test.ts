import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { dash } from "../heroes/dash.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fireAndBrimstoneRed } from "./fire-and-brimstone.ts";

/**
 * Fire and Brimstone (FNG013) — Draconic Warrior Attack Reaction, cost 2, 3{d}.
 *
 * Printed: "Legendary. This costs {r} less to play for each Draconic chain
 * link you control. Daggers you control get +1{p} and you may attack with
 * each of them an additional time this turn."
 *
 * The +1{p} applies to daggers you control, including the attacking dagger
 * (CR 7.2.2b source stays equipped). Extra-activation still binds `them`.
 */

describe("Fire and Brimstone (FNG013) AAA", () => {
  it("happy: a Draconic chain link reduces the play cost by 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [fireAndBrimstoneRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    expectFabPlayer(Fang).toHaveResourceCount(2);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(fireAndBrimstoneRed);
    game.passBoth();

    // Printed cost 2, minus 1 Draconic chain link = 1{r}.
    expectFabPlayer(Fang).toHaveResourceCount(1);
    expectFabCard(Fang, fireAndBrimstoneRed).toBeIn("graveyard");
  });

  it("happy: the attacking dagger gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [fireAndBrimstoneRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(fireAndBrimstoneRed);
    game.passBoth();

    // 1 + 1 — this link's Draconic reaction also turns on Obsidian Fire
    // Vein's printed "+1{p} and go again".
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: a non-dagger attack stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [fireAndBrimstoneRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(fireAndBrimstoneRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, fireAndBrimstoneRed).toBeIn("graveyard");
  });

  it("timing: the additional activation is granted without an optional prompt", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [fireAndBrimstoneRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    const reactionId = Fang.findCardInZone("hand", fireAndBrimstoneRed);
    game.playInstance(Fang.id, reactionId, undefined, "explicit");
    game.passBoth();
    // CR 5.2.3c: the grant applies by itself — no "use the optional effect?"
    // decision may appear while the reaction resolves.
    expectWait(game).notToHaveDecision();
    game.helpers.resolveUntilIdle();

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    expectCombat(game).toBeOpen();
  });
});
