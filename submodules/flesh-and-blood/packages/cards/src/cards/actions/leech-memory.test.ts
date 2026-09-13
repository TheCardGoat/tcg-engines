import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { leechMemoryRed } from "./leech-memory.ts";

/**
 * Leech Memory (OMN091) — Runeblade Action, cost 1, go again.
 *
 * Printed: The next attack action card you play this turn gets +3{p} and
 * "Whenever this deals damage to a hero, you may put an attack action card
 * from your graveyard on the bottom of your deck."
 */

describe("Leech Memory (OMN091) AAA", () => {
  it("happy: the next attack action gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechMemoryRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(leechMemoryRed);
    game.untilIdle({ optionals: "decline" });
    Viserai.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Viserai, leechMemoryRed).toBeIn("graveyard");
  });

  it("boundary: a later attack action does not get the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechMemoryRed, brutalAssaultBlue, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const assaults = Viserai.cardsIn("hand", brutalAssaultBlue);

    Viserai.play(leechMemoryRed);
    game.untilIdle({ optionals: "decline" });
    Viserai.playAttack(assaults[0]!);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });
    Viserai.playAttack(assaults[1]!);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a hit may put an attack action from graveyard on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechMemoryRed, brutalAssaultBlue],
        graveyard: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(leechMemoryRed);
    game.untilIdle({ optionals: "decline" });
    Viserai.playAttack(brutalAssaultBlue);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expect(Viserai.zone("deck")[0]).toBe(snatchRed.canonicalId);
  });
});
