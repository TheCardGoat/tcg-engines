import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blazenYoroi } from "./blazen-yoroi.ts";

/**
 * Blazen Yoroi (DYN045) — Ninja Chest d1, Blade Break.
 * Printed: "While Blazen Yoroi is defending on chain link 4 or higher, it
 * has +4{d}."
 */

describe("Blazen Yoroi (DYN045) AAA", () => {
  it("happy: defending on chain link 4 the yoroi blocks with 5{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 4,
        deck: 6,
      },
      { hero: katsu, chest: [blazenYoroi], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Katsu = game.as(katsu);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Katsu.defendWith(blazenYoroi);

    expectFabCard(Katsu, blazenYoroi).toHaveDefense(5);
    game.helpers.resolveRestOfCombat();
    // Links 1-3 landed unblocked (3 x 4); the 5{d} block stops link 4.
    expectFabPlayer(Katsu).toHaveLife(8);
  });

  it("boundary: on chain link 1 the yoroi keeps its printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, chest: [blazenYoroi], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Katsu = game.as(katsu);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Katsu.defendWith(blazenYoroi);

    expectFabCard(Katsu, blazenYoroi).toHaveDefense(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Katsu).toHaveLife(17);
  });
});
