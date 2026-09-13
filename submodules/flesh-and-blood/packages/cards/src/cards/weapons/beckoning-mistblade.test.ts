import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nuu } from "../heroes/nuu.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { beckoningMistblade } from "./beckoning-mistblade.ts";

/**
 * Beckoning Mistblade (LGS290) — Mystic Assassin Weapon - Dagger (1H), 1{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack. Go again
 *   When this hits, your next blue attack this turn gets +1{p} and go again.
 */

describe("Beckoning Mistblade (LGS290) AAA", () => {
  it("happy: the mistblade attack has go again, and the next blue attack gets +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        weapon1: [beckoningMistblade],
        hand: [brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.activateAttack(beckoningMistblade);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // Go again refunded the action point; the hit armed the blue latch.
    expectFabPlayer(Nuu).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(19);

    Nuu.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(5); // 4 + 1
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: a red Snatch does not get +1{p} or go again", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        weapon1: [beckoningMistblade],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.activateAttack(beckoningMistblade);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Nuu).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(19);

    Nuu.playAttack(snatchRed);
    // Snatch red is printed 4{p}. A color-blind latch would be 5{p} with go again.
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Nuu).toHaveAP(0);
  });

  it("timing: the blue latch expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        weapon1: [beckoningMistblade],
        hand: [brutalAssaultBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.activateAttack(beckoningMistblade);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Nuu.endTurn();
    Dash.endTurn();
    game.untilIdle();

    Nuu.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
