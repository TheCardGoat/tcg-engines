import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabYellow } from "../actions/head-jab.ts";
import { snatchRed } from "../actions/snatch.ts";
import { maskOfMomentum } from "./mask-of-momentum.ts";

describe("Mask of Momentum (WTR079) AAA", () => {
  it("happy: third consecutive AAC hit draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabYellow, headJabYellow, headJabYellow],
        head: [maskOfMomentum],
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(bravo);

    Katsu.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(headJabYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Katsu).toHaveHandCount(1);
  });

  it("boundary: two consecutive hits do not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabYellow, headJabYellow],
        head: [maskOfMomentum],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(bravo);

    Katsu.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(headJabYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Katsu).toHaveHandCount(0);
  });

  it("timing: once per turn — a fourth consecutive hit does not draw again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabYellow, headJabYellow, headJabYellow, headJabYellow],
        head: [maskOfMomentum],
        actionPoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(bravo);

    Katsu.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(headJabYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Katsu).toHaveHandCount(1);
  });

  it("boundary: a miss resets the hit run so a later link-3 hit does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabYellow, headJabYellow, headJabYellow],
        head: [maskOfMomentum],
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(bravo);
    const Dash = game.as(dash);

    Katsu.playAttack(headJabYellow);
    Dash.defendWith(snatchRed);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Katsu.playAttack(headJabYellow);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Katsu.playAttack(headJabYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Katsu).toHaveHandCount(0);
  });
});
