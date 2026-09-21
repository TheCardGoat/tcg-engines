import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { dash } from "../heroes/dash.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dynasticDedicationRed } from "./dynastic-dedication.ts";

/**
 * Dynastic Dedication (FNG011) — Draconic Warrior Attack Reaction, cost 2, 2{d}.
 *
 * Printed: "This costs {r} less to play for each Draconic chain link you
 * control. Target dagger attack gets +3{p}."
 */

describe("Dynastic Dedication (FNG011) AAA", () => {
  it("happy: target dagger attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [dynasticDedicationRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.passBoth();
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(dynasticDedicationRed);
    game.passBoth();

    // Obsidian Fire Vein 1 + 3, plus its live "+1{p} and go again" turned on
    // by this link's Draconic reaction = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Fang, dynasticDedicationRed).toBeIn("graveyard");
  });

  it("boundary: targeting a non-dagger attack does not grant +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [dynasticDedicationRed, snatchRed],
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
    expectFabUnplayable(() =>
      Fang.must.playReaction(dynasticDedicationRed, {
        targetInstanceId: Fang.cardIn("combatChain", snatchRed).instanceId,
      }),
    );
    game.passBoth();

    // Snatch is not a dagger; the +3{p} does not apply.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a Draconic chain link reduces the play cost by 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [dynasticDedicationRed],
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
    game.passBoth();
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(dynasticDedicationRed);
    game.passBoth();

    // Printed cost 2, minus 1 Draconic chain link (the dagger itself) = 1{r}.
    expectFabPlayer(Fang).toHaveResourceCount(1);
    // 1 + 3 + Obsidian Fire Vein's live Draconic-link +1{p}.
    expectCombat(game).toHaveAttackPower(5);
  });
});
